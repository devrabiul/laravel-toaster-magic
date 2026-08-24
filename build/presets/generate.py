"""Emit preset packs from the catalogues.

A preset is a base icon plus at most one badge glyph. Badge presets all share
the `badge` animation, so 300 of them cost two CSS rules rather than 600 — the
icon is what distinguishes them, which is the invariant the tests enforce.
"""
import os, re, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from bases import BASES
from catalogue import C
from catalogue2 import C2
from catalogue3 import C3

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ALL = C + C2 + C3

# Badge glyphs sit bottom-right and share one class, so one selector animates
# every badge in every pack.
BADGES = {
 "tick":  '<path d="m15.5 18 2 2 4-4" stroke-width="2.5"/>',
 "x":     '<path d="m16 16 5 5"/><path d="m21 16-5 5"/>',
 "plus":  '<path d="M19 15v6"/><path d="M16 18h6"/>',
 "minus": '<path d="M16 18h6" stroke-width="2.5"/>',
 "clock": '<circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/>',
 "bang":  '<path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/>',
 "up":    '<path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/>',
 "down":  '<path d="M19 15v6"/><path d="m16 18 3 3 3-3"/>',
}

# hue -> (light i1, light i3, dark i1, dark i3); role -> (light i2, dark i2)
HUES = {
 "slate":  ("#475569", "#e2e8f0", "#cbd5e1", "#334155"),
 "blue":   ("#1d4ed8", "#dbeafe", "#60a5fa", "#1e3a8a"),
 "cyan":   ("#0e7490", "#cffafe", "#22d3ee", "#164e63"),
 "teal":   ("#0f766e", "#ccfbf1", "#5eead4", "#134e4a"),
 "emerald":("#15803d", "#dcfce7", "#4ade80", "#14532d"),
 "amber":  ("#b45309", "#fef3c7", "#fbbf24", "#78350f"),
 "orange": ("#c2410c", "#ffedd5", "#fb923c", "#7c2d12"),
 "rose":   ("#be123c", "#ffe4e6", "#fb7185", "#881337"),
 "violet": ("#6d28d9", "#ede9fe", "#c4b5fd", "#4c1d95"),
}
ROLES = {
 "ok":      ("#16a34a", "#4ade80"),
 "bad":     ("#dc2626", "#f87171"),
 "warn":    ("#d97706", "#fbbf24"),
 "info":    ("#0284c7", "#38bdf8"),
}

def icon_key(base, badge):
    return base if badge is None else f"{base}_{badge}"

def build_icon(base, badge):
    frag = BASES[base].replace("{S2}", "' + S2 + '").replace("{S3}", "' + S3 + '") \
                      .replace("{F2}", "' + F2 + '").replace("{F3}", "' + F3 + '")
    if badge:
        frag += '<g class="tm-badge-glyph"\' + S2 + \'>' + BADGES[badge] + "</g>"
    return "ICON_ATTRS + '" + frag + "</svg>'"

# Characteristic hue per pack, used when a preset has to move off a colour that
# is already taken by an identical-looking one.
PACK_HUE = {
 "general": "slate", "commerce": "amber", "saas": "blue", "social": "violet",
 "devops": "cyan", "media": "rose", "files": "teal", "health": "rose",
 "travel": "cyan", "education": "violet", "crm": "emerald",
}


def resolve_collisions(rows):
    """Guarantee no two presets look identical.

    Two presets are indistinguishable only when their icon, their motion *and*
    their palette all match — colour is a real differentiator here, since the
    badge system deliberately reuses geometry across domains. Where that triple
    repeats, later entries are moved onto another hue, preferring the one that
    is characteristic of their own pack.
    """
    taken, out = set(), []

    for name, base, badge, pack, hue, role, motion in rows:
        anim = "badge" if badge else motion
        key = icon_key(base, badge)
        order = [hue, PACK_HUE.get(pack, "slate")] + list(HUES)

        for candidate in order:
            if (key, anim, candidate, role) not in taken:
                hue = candidate
                break

        taken.add((key, anim, hue, role))
        out.append((name, base, badge, pack, hue, role, motion))

    return out


ALL = resolve_collisions(ALL)

# ---- group by pack ----
by_pack = collections.defaultdict(list)
for row in ALL:
    by_pack[row[3]].append(row)

NEW_PACKS = ["health", "travel", "education", "crm"]
DESC = {
 "health":    "Clinical and wellbeing flows: appointments, prescriptions, vitals, lab work.",
 "travel":    "Flights, stays, ground transport and itineraries.",
 "education": "Courses, lessons, assignments, grading and library.",
 "crm":       "Leads, deals, accounts, calls and forecasting.",
 "general":   "Cross-cutting states any project has.",
 "commerce":  "Storefront and back office.",
 "saas":      "Subscriptions, workspaces, seats, usage and integrations.",
 "social":    "Messaging, posts, connections and moderation.",
 "devops":    "Builds, deploys, infrastructure, source control and incidents.",
 "media":     "Capture, encoding, publishing and playback.",
 "files":     "Documents, storage, backups and scanning.",
}

def js_entries(rows):
    icons, presets = {}, []
    for name, base, badge, pack, hue, role, motion in rows:
        k = icon_key(base, badge)
        icons.setdefault(k, build_icon(base, badge))
        anim = "badge" if badge else motion
        presets.append(f'        "{name}": {{ icon: "{k}", anim: "{anim}" }}')
    ilines = ",\n".join(f"        {k}: {v}" for k, v in icons.items())
    return ilines, ",\n".join(presets), len(icons)

BEGIN = "        // >>> generated by build/presets/generate.py"
END = "        // <<< generated"


def wrap(block):
    return f"{BEGIN}\n{block}\n{END}"


def strip_generated(src):
    """Remove any previously generated block.

    Without this the generator appends on every run, which silently duplicated
    every key the second time it was invoked.
    """
    while BEGIN in src:
        a = src.index(BEGIN)
        b = src.index(END, a) + len(END)
        # take the comma that joined this block to the entry before it
        a = src.rfind(",", 0, a)
        src = src[:a] + src[b:]
    return src


def emit():
    """Write the pack files.

    Guarded behind __main__ so importing this module for its tables (HUES,
    ROLES, ALL) cannot rewrite the packs as a side effect — doing exactly that
    inserted every preset twice.
    """
    written = {}

    for pack, rows in by_pack.items():
        path = os.path.join(ROOT, f"assets/js/presets/toast-magic-presets-{pack}.js")
        ilines, plines, nicons = js_entries(rows)

        if pack in NEW_PACKS:
            open(path, "w", encoding="utf-8").write(new_pack_file(pack, ilines, plines))
        else:
            src = strip_generated(open(path, encoding="utf-8").read())
            src = src.replace("\n    }, {", ",\n" + wrap(ilines) + "\n    }, {", 1)
            src = re.sub(r'\n    \}, "' + pack + r'"\);',
                         ",\n" + wrap(plines) + f'\n    }}, "{pack}");', src, count=1)
            open(path, "w", encoding="utf-8").write(src)

        written[pack] = (len(rows), nicons)

    return written


def shorthand_decl(ilines):
    """Declare only the paint shorthands this pack's icons actually use.

    Declaring all four unconditionally left `F2`/`F3` unused in packs whose
    icons never fill anything, which the linter reports as dead code.
    """
    used = [n for n in ("S2", "S3", "F2", "F3") if f"' + {n} + '" in ilines]
    parts = ["ICON_ATTRS = P.attrs"] + [f"{n} = P.{n.lower()}" for n in used]
    return "    var " + ", ".join(parts) + ";"


def new_pack_file(pack, ilines, plines):
    shorthands = shorthand_decl(ilines)
    return f"""/*!
 * Laravel Toaster Magic — preset pack: {pack}
 *
 * {DESC[pack]}
 *
 * Loaded only when this pack is listed under `presets` in the config. It
 * registers into the shared runtime, which must be loaded first — the pack
 * adds no behaviour of its own, only icons and their motion.
 *
 * Icon geometry is Lucide v1.33.0 — ISC License, Copyright (c) 2026 Lucide
 * Icons and Contributors. Some icons derive from Feather — MIT License,
 * Copyright (c) 2013-present Cole Bemis.
 */
(function () {{
    "use strict";

    var P = window.ToastMagicPresets;

    if (!P) {{
        if (window.console && window.console.warn) {{
            window.console.warn("[toast-magic] preset pack \\"{pack}\\" loaded before the runtime; ignoring.");
        }}
        return;
    }}

{shorthands}

    P.register({{
{ilines}
    }}, {{
{plines}
    }}, "{pack}");
}})();
"""


if __name__ == "__main__":
    for name, (n, i) in sorted(emit().items()):
        print(f"  {name:10s} +{n:3d} presets, +{i:3d} icons")
