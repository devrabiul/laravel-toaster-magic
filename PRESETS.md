# 🎬 Animated Toast Presets

517 ready-made animated icons that sit **on top of** the toast types you
already use, split into 11 opt-in packs. Added in **v2.6**.

---

## 📖 What a preset is

A **preset** is a presentation layer on top of an existing toast type. It does
not replace the type and it is not a new type.

| Layer | Owns | Values |
|---|---|---|
| **Type** | Colour, progress bar, screen-reader urgency, theme styling | `success`, `error`, `warning`, `info` |
| **Preset** | Which icon is drawn, and how that icon animates | `cart-add`, `payment-failed`, … |

Reading the canonical example:

```php
ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'preset' => 'cart-add',
]);
```

* **Type** = `success` → green accent, green progress bar, polite announcement
* **Preset** = `cart-add` → replaces the icon and gives it motion
* **Icon** = `cart`
* **Animation** = `bounce`

The type still does everything it did before. The preset only changes the icon
and its animation.

### What a preset does **not** change

* **The type.** `ToastMagic::error(…, ['preset' => 'payment-failed'])` is still
  an error toast — red accent, red progress bar, assertive announcement.
* **Screen-reader urgency.** Politeness is derived from the type alone, never
  from the preset. A preset cannot make a `success` toast interrupt a screen
  reader, and preset icons are `aria-hidden` like every other icon.
* **Position, theme, timing, close button, action button.** All still come from
  config and the usual per-toast options.
* **The entrance/exit animation** of the toast itself. That remains the global
  `animation` config value. A preset animates the *icon*; the one exception is
  `payment-failed`, whose `shake` moves the toast content — see
  [Motion notes](#-motion-notes).

---

## 📦 Packs

Presets are shipped in packs so a project loads only what it uses. The core
runtime contains none; each pack is one extra script and one stylesheet.

```php
// config/laravel-toaster-magic.php
'presets' => ['general', 'commerce'],   // or 'all', or [] for none
```

| Pack | Presets | Covers |
|---|---:|---|
| `general` | 76 | Loading, connectivity, auth, clipboard, preferences, device state |
| `commerce` | 121 | Carts, orders, payments, shipping, catalogue, promotions, stock |
| `saas` | 44 | Subscriptions, workspaces, seats, usage, integrations |
| `social` | 38 | Messages, posts, connections, reviews, moderation |
| `devops` | 61 | Builds, deploys, source control, infrastructure, incidents |
| `media` | 36 | Capture, encoding, publishing, playback |
| `files` | 37 | Documents, storage, backups, scanning |
| `health` | 28 | Appointments, prescriptions, vitals, lab work |
| `travel` | 26 | Flights, stays, ground transport, itineraries |
| `education` | 25 | Courses, lessons, assignments, grading, library |
| `crm` | 25 | Leads, deals, accounts, calls, forecasting |

A preset from a pack that is not enabled is **dropped server-side** and the toast
renders with its type icon — the runtime would not recognise the name either, so
failing in one place is clearer than failing in two.

`ToastMagic::presetManifest()` returns the full pack → preset map, and
`ToastMagic::enabledPacks()` what this application actually loads.

---

## 🚀 Basic usage

Add `preset` to the options array — the same array that already carries
`avatar`, `timeOut` and `customBtnText`:

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'preset' => 'cart-add',
]);
```

### Title only

The description argument stays optional exactly as it is today:

```php
ToastMagic::success('Added to cart', null, [
    'preset' => 'cart-add',
]);
```

### Title + description

```php
ToastMagic::success('Added to cart', 'Nike Air Max ×1 — €129.00', [
    'preset' => 'cart-add',
]);
```

### With custom options

`preset` composes with every existing option. Nothing is mutually exclusive
except `avatar` (see below):

```php
ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'preset'        => 'cart-add',
    'showCloseBtn'  => true,
    'customBtnText' => 'View cart',
    'customBtnLink' => '/cart',
    'timeOut'       => 8000,
    'showDuration'  => 300,
]);
```

### Fluent syntax

```php
ToastMagic::dispatch()->success('Added to cart', 'Nike Air Max ×1', [
    'preset' => 'cart-add',
]);
```

---

## 📋 Available presets

517 presets, each with a multi-coloured icon and its own animation.
**Base type** is the recommended type to pair each with — a recommendation, not
a restriction: any preset may be used with any type.

| Preset | Icon | Animation | Base type |
|---|---|---|---|
| `cart-add` | cart | `bounce` | `success` |
| `cart-update` | cart with quantity arrows | `cart-swap` | `info` |
| `cart-remove` | cart with a minus | `cart-out` | `warning` |
| `comment-posted` | reply bubble | `reply-fly` | `success` |
| `follow-removed` | user with a minus | `minus-fade` | `info` |
| `user-blocked` | user with a cross | `block-strike` | `warning` |
| `invite-sent` | two figures | `invite-wave` | `success` |
| `photo-uploaded` | picture frame | `frame-fill` | `success` |
| `deploy-succeeded` | rocket | `rocket-launch` | `success` |
| `maintenance-mode` | wrench | `wrench-turn` | `warning` |
| `theme-changed` | crescent moon | `moon-swap` | `info` |
| `language-changed` | two scripts | `glyph-swap` | `info` |
| `filter-applied` | funnel | `funnel-settle` | `info` |
| `points-earned` | award medal | `award-shine` | `success` |
| `wallet-topped-up` | wallet | `wallet-fill` | `success` |
| `qr-generated` | QR code | `qr-scan` | `success` |
| `terms-accepted` | file with a tick | `terms-mark` | `success` |
| `deploy-failed` | server rack with a bolt | `crash-shake` | `error` |
| `recording-started` | microphone | `mic-live` | `info` |
| `mic-muted` | microphone struck through | `mic-cut` | `info` |
| `camera-off` | camera struck through | `lens-cut` | `info` |
| `screen-shared` | monitor with an arrow | `screen-cast` | `info` |
| `invoice-paid` | receipt | `receipt-stamp` | `success` |
| `pinned` | push pin | `pin-press` | `success` |
| `unpinned` | pin struck through | `pin-lift` | `info` |
| `folder-created` | folder with a plus | `folder-grow` | `success` |
| `duplicated` | two sheets with a plus | `copy-split` | `success` |
| `reminder-set` | alarm clock | `alarm-tick` | `success` |
| `gift-sent` | gift box | `gift-shake` | `success` |
| `celebration` | party popper | `confetti-burst` | `success` |
| `rate-limited` | gauge | `gauge-swing` | `warning` |
| `checkout-started` | shopping bag | `bag-swing` | `info` |
| `order-cancelled` | struck-through disc | `order-void` | `error` |
| `return-requested` | return arrow | `return-arc` | `info` |
| `price-dropped` | falling trend line | `price-fall` | `success` |
| `stock-low` | parcel with a minus | `stock-dip` | `warning` |
| `product-added` | parcel with a plus | `product-add` | `success` |
| `inventory-updated` | stacked tiers | `stack-shuffle` | `info` |
| `compare-added` | balance scale | `scale-tip` | `info` |
| `free-shipping-unlocked` | percent badge | `perk-unlock` | `success` |
| `gift-card-applied` | gift card | `card-flip` | `success` |
| `subscription-renewed` | loop arrows | `renew-loop` | `success` |
| `subscription-cancelled` | calendar with a cross | `plan-void` | `warning` |
| `barcode-scanned` | barcode in a frame | `scan-line` | `success` |
| `preorder-placed` | calendar with a clock | `preorder-hold` | `success` |
| `out-for-delivery` | courier bike | `courier-ride` | `info` |
| `pickup-ready` | shopfront | `store-open` | `success` |
| `product-published` | open eye | `eye-open` | `success` |
| `product-unpublished` | struck-through eye | `eye-shut` | `info` |
| `size-guide-opened` | ruler | `ruler-measure` | `info` |
| `currency-changed` | coin | `coin-spin` | `info` |
| `payout-sent` | bank | `bank-transfer` | `success` |
| `dispute-opened` | gavel | `gavel-strike` | `error` |
| `order-on-hold` | pause disc | `hold-pulse` | `warning` |
| `csv-imported` | spreadsheet | `sheet-fill` | `success` |
| `warranty-registered` | shield with a plus | `warranty-seal` | `success` |
| `eco-delivery` | leaf | `leaf-sway` | `success` |
| `delivery-failed` | map pin with a cross | `drop-miss` | `error` |
| `payment-pending` | credit card with a clock | `card-wait` | `warning` |
| `payment-method-added` | credit card with a plus | `card-add` | `success` |
| `payment-method-removed` | credit card with a minus | `card-drop` | `info` |
| `payment-retry` | credit card with a loop | `card-retry` | `warning` |
| `card-expiring` | credit card with a bang | `card-expire` | `warning` |
| `installment-selected` | pie chart | `slice-fill` | `info` |
| `refund-declined` | coins with a cross | `refund-void` | `error` |
| `address-verified` | map pin with a tick | `pin-verify` | `success` |
| `address-invalid` | map pin with a bang | `pin-alert` | `error` |
| `tracking-added` | parcel with a lens | `parcel-scan` | `info` |
| `partial-shipment` | splitting path | `parcel-split` | `info` |
| `international-shipping` | globe | `globe-spin` | `info` |
| `customs-cleared` | rubber stamp | `customs-stamp` | `success` |
| `signature-required` | signature | `sign-line` | `warning` |
| `shipping-calculated` | calculator | `calc-tally` | `info` |
| `tag-added` | price tag | `tag-flip` | `success` |
| `category-created` | folder tree | `tree-grow` | `success` |
| `bundle-created` | sealed carton | `bundle-bind` | `success` |
| `variant-added` | palette | `swatch-cycle` | `success` |
| `seo-updated` | lens with a tick | `seo-check` | `success` |
| `bulk-edit-applied` | checklist | `list-tick` | `success` |
| `stocktake-completed` | clipboard with a tick | `tally-done` | `success` |
| `flash-sale-started` | flame | `flame-flicker` | `info` |
| `sale-ended` | struck-through timer | `timer-stop` | `info` |
| `coupon-expired` | ticket with a cross | `coupon-void` | `warning` |
| `coupon-invalid` | ticket with a bang | `coupon-warn` | `error` |
| `reward-redeemed` | sparkles | `spark-burst` | `success` |
| `referral-earned` | handshake | `hands-meet` | `success` |
| `newsletter-subscribed` | envelope with a plus | `mail-join` | `success` |
| `newsletter-unsubscribed` | envelope with a minus | `mail-leave` | `info` |
| `review-approved` | star with a tick | `star-approve` | `success` |
| `review-rejected` | star with a cross | `star-reject` | `warning` |
| `question-answered` | bubble with a tick | `answer-mark` | `success` |
| `stock-notify-requested` | bell with a plus | `bell-subscribe` | `success` |
| `account-created` | user with a tick | `account-open` | `success` |
| `guest-checkout` | open door | `guest-enter` | `info` |
| `cart-merged` | merging path | `merge-join` | `info` |
| `cart-expired` | cart with a clock | `cart-lapse` | `warning` |
| `recently-viewed` | history dial | `history-rewind` | `info` |
| `order-issue-reported` | disc with a bang | `issue-flag` | `error` |
| `store-closed` | struck-through shopfront | `store-shut` | `warning` |
| `wishlist-add` | heart | `pop-particles` | `success` |
| `wishlist-remove` | broken heart | `heart-break` | `info` |
| `order-placed` | package box | `box-drop` | `success` |
| `payment-success` | banknote | `note-swipe` | `success` |
| `payment-failed` | declined card | `card-strike` | `error` |
| `item-removed` | trash | `lid-lift` | `warning` |
| `clipboard-copy` | clipboard | `clip-snap` | `success` |
| `link-shared` | share nodes | `nodes-pulse` | `info` |
| `profile-updated` | user | `user-pop` | `success` |
| `settings-saved` | gear | `gear-spin` | `success` |
| `download-complete` | download arrow | `arrow-down` | `success` |
| `upload-complete` | upload arrow | `arrow-up` | `success` |
| `connection-restored` | wi-fi arcs | `arcs-stagger` | `success` |
| `connection-lost` | wi-fi struck through | `signal-drop` | `error` |
| `loading` | spinner | `spin-loop` | `info` |
| `session-expiring` | clock | `clock-sweep` | `warning` |
| `out-of-stock` | parcel with a cross | `stock-out` | `warning` |
| `back-in-stock` | ringing bell | `bell-ring` | `success` |
| `coupon-applied` | percent ticket | `ticket-punch` | `success` |
| `email-sent` | paper plane | `plane-launch` | `success` |
| `password-changed` | padlock | `lock-shut` | `success` |
| `login` | arrow into a door | `door-in` | `success` |
| `logout` | arrow out of a door | `door-out` | `info` |
| `order-shipped` | delivery truck | `truck-drive` | `info` |
| `order-delivered` | opened parcel | `parcel-open` | `success` |
| `message-received` | chat bubble | `bubble-pop` | `info` |
| `review-submitted` | star | `star-twinkle` | `success` |
| `refund-issued` | hand with coins | `coins-return` | `info` |
| `subscription-upgraded` | crown | `crown-rise` | `success` |
| `email-verified` | scalloped badge | `badge-pulse` | `success` |
| `sync-complete` | refresh arrows | `sync-turn` | `success` |
| `draft-saved` | file and pen | `pen-write` | `info` |
| `bookmark-saved` | bookmark | `bookmark-drop` | `success` |
| `follow-added` | user with a plus | `plus-pop` | `success` |
| `appointment-booked` | calendar with a tick | `calendar-mark` | `success` |
| `no-results` | lens with a cross | `search-sweep` | `warning` |
| `permission-denied` | shield with a bang | `shield-warn` | `error` |
| `file-rejected` | file with a cross | `file-reject` | `error` |
| `export-ready` | file with an arrow | `file-descend` | `success` |
| `print-sent` | printer | `print-feed` | `info` |
| `address-saved` | map pin | `pin-drop` | `success` |
| `otp-sent` | phone | `phone-buzz` | `info` |
| `two-factor-enabled` | shield with a tick | `shield-lock` | `success` |
| `api-key-generated` | key | `key-turn` | `success` |
| `like-added` | thumbs up | `thumb-up` | `success` |
| `notifications-muted` | bell struck through | `bell-mute` | `info` |
| `archived` | archive box | `archive-in` | `info` |
| `restored` | archive box with an arrow | `archive-out` | `success` |
| `backup-complete` | database | `disk-stack` | `success` |
| `cache-cleared` | lightning bolt | `bolt-flash` | `success` |
| `trial-ending` | hourglass | `sand-fall` | `warning` |

The list is available in code as `ToastMagic::PRESETS`, so it can be asserted
against in tests or used to build a picker.

> **`cart-remove` and `item-removed` overlap.** The first is cart-specific — the
> same basket as `cart-add` and `cart-update`, with a minus in it. The second is
> a generic trash can for deleting anything. Use whichever matches the wording of
> your toast; there is no need to keep both.

### Animation vocabulary

Every preset has its own. Two things hold across all of them:

* **The icon you pick is the icon that animates.** No preset swaps it out for a
  generic checkmark part-way through.
* **The motion repeats twice, then rests.** Parts of the icon move in sequence
  rather than the whole thing sliding in once, so a preset still reads as
  animated a second after it lands. Keyframes start and end on the same frame,
  so the two passes run as one continuous movement. `loading` is the single
  exception: it spins until the toast goes away, because it reports work still
  in progress.

| Animation | Behaviour |
|---|---|
| `bounce` | Cart bobs while its two wheels pulse in sequence |
| `cart-swap` | Basket bobs while the two quantity arrows fire in opposition |
| `cart-out` | Basket tips back as if tipping something out; the minus flashes |
| `reply-fly` | Bubble bobs while the reply arrow nudges back |
| `minus-fade` | Figure tips back as the minus dims and returns |
| `block-strike` | Figure rocks while the cross flashes |
| `invite-wave` | First figure pulses, then the second slides on beside it |
| `frame-fill` | Frame swells while the sun inside it pulses |
| `rocket-launch` | Craft lifts along its own diagonal as the exhaust flares |
| `wrench-turn` | Wrench turns against the thread and eases back |
| `moon-swap` | Crescent rolls as if the light source moved |
| `glyph-swap` | One script brightens, then hands over to the other |
| `funnel-settle` | Funnel squeezes as something passes through it |
| `award-shine` | Medal lifts while its ribbon sways |
| `wallet-fill` | Wallet bobs while the card slot brightens |
| `qr-scan` | Three registration squares light in sequence, like a scan locking on |
| `terms-mark` | Page bobs while the tick pulses |
| `crash-shake` | Toast shakes while the fault bolt flashes in the rack |
| `mic-live` | Capsule pulses like a live level meter |
| `mic-cut` | Diagonal is drawn across a mic that dims behind it |
| `lens-cut` | Diagonal is drawn across the camera body |
| `screen-cast` | Arrow lifts out of a monitor that brightens |
| `receipt-stamp` | Slip presses down as if stamped; the amount flashes |
| `pin-press` | Pin presses down into the surface |
| `pin-lift` | Pin rises as the diagonal is drawn across it |
| `folder-grow` | Folder swells while the plus pulses |
| `copy-split` | Front sheet slides clear of the back one |
| `alarm-tick` | Bells rattle while the hands sweep |
| `gift-shake` | Box rocks while the ribbon brightens |
| `confetti-burst` | Cone kicks back and the sparks fire outward in sequence |
| `gauge-swing` | Needle swings up against the limit and falls back |
| `bag-swing` | Bag rocks while its handle brightens |
| `order-void` | Bar is drawn across the disc while the toast shakes |
| `return-arc` | Arrowhead travels back along its own arc |
| `price-fall` | Trend line slides down its own slope |
| `stock-dip` | Parcel sags while the minus brightens |
| `product-add` | Parcel bobs while the plus pulses |
| `stack-shuffle` | Lower tiers settle in sequence, as if restacked |
| `scale-tip` | The two pans tip against each other |
| `perk-unlock` | Badge swells while the percent brightens |
| `card-flip` | Card turns half a rotation, as if presented |
| `renew-loop` | Loop bobs while both arrowheads pulse |
| `plan-void` | Cross pulses inside a calendar that dims behind it |
| `scan-line` | Bars light left to right, like a beam passing over them |
| `preorder-hold` | Clock hands sweep the wait beside a fixed date |
| `courier-ride` | Frame rocks forward while both wheels turn |
| `store-open` | Awning ripples, then the doorway grows open |
| `eye-open` | Eye blinks while the pupil pulses |
| `eye-shut` | Diagonal is drawn across an eye that dims behind it |
| `ruler-measure` | Graduations light along the rule, as if being read off |
| `coin-spin` | Coin turns half a rotation onto its other face |
| `bank-transfer` | Columns light left to right, money moving through |
| `gavel-strike` | Mallet swings down while the toast shakes |
| `hold-pulse` | Pause bars pulse inside a dimming disc |
| `sheet-fill` | Cells fill row by row |
| `warranty-seal` | Shield swells while the plus pulses |
| `leaf-sway` | Leaf sways while the stem brightens |
| `drop-miss` | Pin drops for the delivery; the cross flashes for the miss |
| `card-wait` | Card bobs while the clock badge pulses |
| `card-add` | Card bobs while the plus badge pulses |
| `card-drop` | Card bobs while the minus badge pulses |
| `card-retry` | Card bobs while the retry loop pulses |
| `card-expire` | Card bobs while the warning badge pulses |
| `slice-fill` | Wedge holds while the remaining arc sweeps |
| `refund-void` | Coins bob while the cross badge pulses |
| `pin-verify` | Pin bobs while the tick badge pulses |
| `pin-alert` | Pin bobs while the warning badge pulses |
| `parcel-scan` | Parcel bobs while the lens pulses over it |
| `parcel-split` | The two forks light in turn — one consignment becoming two |
| `globe-spin` | Meridians turn half a rotation |
| `customs-stamp` | Stamp presses down onto its pad |
| `sign-line` | Flourish draws itself once above a pulsing baseline |
| `calc-tally` | Keypad rows light in sequence |
| `tag-flip` | Tag tilts while its eyelet pulses |
| `tree-grow` | Branches settle top-down, the way a tree renders |
| `bundle-bind` | Carton bobs while the band pulses |
| `swatch-cycle` | The four swatches light round the palette in order |
| `seo-check` | Lens bobs while the tick badge pulses |
| `list-tick` | Both ticks land in sequence over pulsing rows |
| `tally-done` | Clipboard bobs while the tick badge pulses |
| `flame-flicker` | Flame stretches and leans as it burns |
| `timer-stop` | Diagonal is drawn across a timer that dims |
| `coupon-void` | Ticket bobs while the cross badge pulses |
| `coupon-warn` | Ticket bobs while the warning badge pulses; the toast shakes |
| `spark-burst` | Star swells and rolls while the sparks flare |
| `hands-meet` | The two hands close on each other |
| `mail-join` | Envelope bobs while the plus badge pulses |
| `mail-leave` | Envelope bobs while the minus badge pulses |
| `star-approve` | Star bobs while the tick badge pulses |
| `star-reject` | Star bobs while the cross badge pulses |
| `answer-mark` | Bubble bobs while the tick badge pulses |
| `bell-subscribe` | Bell bobs while the plus badge pulses |
| `account-open` | Figure bobs while the tick badge pulses |
| `guest-enter` | Door tilts open while the handle pulses |
| `merge-join` | Path bobs while both arrowheads pulse |
| `cart-lapse` | Cart bobs while the clock badge pulses |
| `history-rewind` | Hands run backwards a full turn |
| `issue-flag` | Exclamation pulses inside a dimming disc; the toast shakes |
| `store-shut` | Diagonal is drawn across a shopfront that dims |
| `pop-particles` | Heart gives a double-thump beat; six particles burst outward once |
| `heart-break` | Heart shudders twice while the crack is drawn across it |
| `box-drop` | Parcel bobs and the lid seam brightens behind it |
| `note-swipe` | Note tilts, the coin pulses, then the side marks brighten |
| `card-strike` | Strike is drawn across the card; the stripe flashes beneath it |
| `lid-lift` | Trash lid pivots off its own left edge, twice, as the contents flash |
| `clip-snap` | Clip presses down onto the board and releases, twice |
| `nodes-pulse` | The three share nodes pulse in sequence |
| `user-pop` | Head pulses, then the shoulders brighten beneath it |
| `gear-spin` | Two full turns read as one continuous rotation |
| `arrow-down` | Arrow dips into the tray, twice, as the tray brightens |
| `arrow-up` | Arrow lifts out of the tray, twice, as the tray brightens |
| `arcs-stagger` | Wi-fi signal builds outward — dot, inner, middle, outer — twice |
| `signal-drop` | Strike is drawn across the arcs, then the dead arcs dim inward |
| `spin-loop` | Spinner turns continuously — the only preset that never stops |
| `clock-sweep` | Hands sweep a full circle inside a still face, twice |
| `stock-out` | Parcel sags while the cross flashes |
| `bell-ring` | Bell rocks and its two ring strokes swing with it |
| `ticket-punch` | Ticket presses in as if punched; the percent mark pops |
| `plane-launch` | Plane lifts away along its own diagonal and returns |
| `lock-shut` | Shackle lifts and drops shut; the body flexes on impact |
| `door-in` | Frame holds still while the arrow steps in through it |
| `door-out` | Frame holds still while the arrow steps out through it |
| `truck-drive` | Cab rocks as if moving; the wheels turn with it |
| `parcel-open` | Lid lifts off the carton and settles back |
| `bubble-pop` | Bubble swells while the three dots type inside it |
| `star-twinkle` | Star swells and rolls, then eases back |
| `coins-return` | Hand tips back as the coins bob — money going the other way |
| `crown-rise` | Crown lifts and grows, then settles |
| `badge-pulse` | Scalloped badge pulses while its tick brightens inside |
| `sync-turn` | Two full turns of the refresh arrows |
| `pen-write` | Nib travels its own diagonal as if writing the line |
| `bookmark-drop` | Bookmark lifts and stretches, then drops back |
| `plus-pop` | The plus pulses, then the head brightens beside it |
| `calendar-mark` | Tick pulses inside a still calendar frame |
| `search-sweep` | Lens sweeps side to side and finds nothing; the cross flashes |
| `shield-warn` | Shield rocks while the exclamation flashes |
| `file-reject` | File rocks while the cross flashes |
| `file-descend` | Arrow dips down the page, which brightens |
| `print-feed` | Sheet feeds out of a printer that stays put |
| `pin-drop` | Pin lifts and drops; the dot pulses |
| `phone-buzz` | Handset buzzes side to side |
| `shield-lock` | Shield pulses while its tick brightens |
| `key-turn` | Key turns on its own bow; the ring pulses |
| `thumb-up` | Thumb lifts, tilts and grows |
| `bell-mute` | Strike is drawn across a bell that dips instead of ringing |
| `archive-in` | Lid presses down onto the box |
| `archive-out` | Lid hops up and the arrow lifts out behind it |
| `disk-stack` | Top platter settles onto the stack, which pulses |
| `bolt-flash` | Bolt swells and dims like a discharge |
| `sand-fall` | Glass turns over while the sand keeps running |

`payment-failed`, `deploy-failed`, `order-cancelled` and `dispute-opened` also
shake the toast content, along with `coupon-invalid` and `order-issue-reported`
— the only presets that move anything outside the icon.

---

## 🧩 Example for each preset

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

// 1. Add to cart — bouncing cart
ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'preset' => 'cart-add',
]);

// 1b. Cart updated — quantity arrows fire in opposition
ToastMagic::info('Cart updated', 'Quantity changed to 3.', [
    'preset' => 'cart-update',
]);

// 1c. Removed from cart — the basket tips out
ToastMagic::warning('Removed from cart', 'Apple MacBook Pro M5 removed.', [
    'preset' => 'cart-remove',
]);

// 2. Added to wishlist — heart pop + particles
ToastMagic::success('Saved to wishlist', 'Nike Air Max', [
    'preset' => 'wishlist-add',
]);

// 3. Removed from wishlist — heart flinches, crack draws across
ToastMagic::info('Removed from wishlist', 'Nike Air Max', [
    'preset' => 'wishlist-remove',
]);

// 4. Order placed — parcel drops in and settles
ToastMagic::success('Order placed', 'Order #10482 is confirmed.', [
    'preset'        => 'order-placed',
    'customBtnText' => 'Track order',
    'customBtnLink' => '/orders/10482',
]);

// 5. Payment successful — note swipes in, coin pops
ToastMagic::success('Payment successful', '€129.00 charged to •••• 4242.', [
    'preset' => 'payment-success',
]);

// 6. Payment failed — strike draws across the card, toast shakes
ToastMagic::error('Payment failed', 'Your card was declined.', [
    'preset'  => 'payment-failed',
    'timeOut' => 0, // stays until dismissed — the user must act
]);

// 7. Item removed — trash lid lifts
ToastMagic::warning('Item removed', 'Nike Air Max ×1 removed from your cart.', [
    'preset' => 'item-removed',
]);

// 8. Copied to clipboard — clip snaps onto the board
ToastMagic::success('Copied to clipboard', null, [
    'preset'  => 'clipboard-copy',
    'timeOut' => 2000,
]);

// 9. Link shared — share nodes pulse
ToastMagic::info('Link shared', 'Anyone with the link can view this.', [
    'preset' => 'link-shared',
]);

// 10. Profile updated — head pops, shoulders rise
ToastMagic::success('Profile updated', 'Your changes are live.', [
    'preset' => 'profile-updated',
]);

// 11. Settings saved — gear turns a full rotation
ToastMagic::success('Settings saved', null, [
    'preset' => 'settings-saved',
]);

// 12. Download complete — arrow drops into the tray
ToastMagic::success('Download complete', 'invoice-10482.pdf', [
    'preset' => 'download-complete',
]);

// 13. Upload complete — arrow lifts out of the tray
ToastMagic::success('Upload complete', '3 files uploaded.', [
    'preset' => 'upload-complete',
]);

// 14. Connection restored — wi-fi signal rebuilds
ToastMagic::success('Back online', 'Your connection has been restored.', [
    'preset' => 'connection-restored',
]);

// 15. Connection lost — strike draws across the signal
ToastMagic::error('You are offline', 'Reconnecting…', [
    'preset'  => 'connection-lost',
    'timeOut' => 0, // keep it up until the connection is back
]);

// 16. Loading — spins until dismissed
ToastMagic::info('Generating your report', 'This can take a minute.', [
    'preset'  => 'loading',
    'timeOut' => 0, // required: the spinner is a progress signal, not a result
]);

// 17. Session expiring — hands sweep the clock
ToastMagic::warning('Session expiring', 'You will be signed out in 2 minutes.', [
    'preset'        => 'session-expiring',
    'timeOut'       => 0,
    'customBtnText' => 'Stay signed in',
    'customBtnLink' => '/session/extend',
]);

// 18. Out of stock — parcel sags, cross flashes
ToastMagic::warning('Out of stock', 'This size is unavailable.', [
    'preset' => 'out-of-stock',
]);

// 19. Back in stock — the bell rings
ToastMagic::success('Back in stock', 'Apple MacBook Pro M5 is available again.', [
    'preset'        => 'back-in-stock',
    'customBtnText' => 'View',
    'customBtnLink' => '/products/42',
]);

// 20. Coupon applied — the ticket is punched
ToastMagic::success('Coupon applied', 'SAVE20 — €25.80 off.', [
    'preset' => 'coupon-applied',
]);

// 21. Email sent — the plane launches
ToastMagic::success('Email sent', 'A receipt is on its way.', [
    'preset' => 'email-sent',
]);

// 22. Password changed — the padlock shuts
ToastMagic::success('Password changed', 'Sign in again on your other devices.', [
    'preset' => 'password-changed',
]);

// 23. Signed in
ToastMagic::success('Welcome back', 'Signed in as nipon@6amtech.com.', [
    'preset' => 'login',
]);

// 24. Signed out
ToastMagic::info('Signed out', 'See you next time.', [
    'preset' => 'logout',
]);

// 25. Order shipped — the truck rolls
ToastMagic::info('On its way', 'Order #10482 shipped via DHL.', [
    'preset'        => 'order-shipped',
    'customBtnText' => 'Track',
    'customBtnLink' => '/orders/10482/tracking',
]);

// 26. Order delivered — the parcel opens
ToastMagic::success('Delivered', 'Left with the concierge.', [
    'preset' => 'order-delivered',
]);

// 27. New message — the bubble types
ToastMagic::info('New message', 'Hey, are you free to chat?', [
    'preset' => 'message-received',
]);

// 28. Review submitted — the star twinkles
ToastMagic::success('Thanks for your review', 'You rated this 5 stars.', [
    'preset' => 'review-submitted',
]);

// 29. Refund issued — the coins go back
ToastMagic::info('Refund issued', '€129.00 back to •••• 4242 in 3-5 days.', [
    'preset' => 'refund-issued',
]);

// 30. Subscription upgraded — the crown rises
ToastMagic::success('Welcome to Pro', 'Every feature is unlocked.', [
    'preset' => 'subscription-upgraded',
]);

// 31. Email verified — the badge pulses
ToastMagic::success('Email verified', 'Your address is confirmed.', [
    'preset' => 'email-verified',
]);

// 32. Sync complete — the arrows turn
ToastMagic::success('Sync complete', '48 records updated.', [
    'preset' => 'sync-complete',
]);

// 33. Draft saved — the nib writes
ToastMagic::info('Draft saved', 'Saved automatically a moment ago.', [
    'preset'  => 'draft-saved',
    'timeOut' => 2000,
]);

// 34. Bookmarked
ToastMagic::success('Bookmarked', 'Find it later under Saved.', [
    'preset' => 'bookmark-saved',
]);

// 35. Following — the plus pops
ToastMagic::success('Following', 'You will see their updates.', [
    'preset' => 'follow-added',
]);

// 36. Appointment booked — the tick marks the date
ToastMagic::success('Appointment booked', 'Tuesday 2 September, 10:30.', [
    'preset' => 'appointment-booked',
]);

// 37. No results — the lens sweeps and finds nothing
ToastMagic::warning('No results', 'Nothing matched "macbok pro".', [
    'preset' => 'no-results',
]);

// 38. Permission denied — the shield rocks
ToastMagic::error('Permission denied', 'You need an admin role for that.', [
    'preset' => 'permission-denied',
]);
```

> **`loading` and the sticky presets.** A preset never sets timing — that stays
> yours. But `loading`, `connection-lost` and `session-expiring` all describe a
> state rather than a result, so pair them with `timeOut => 0` and dismiss them
> yourself with `toastMagic.clear()` when the state changes. A spinner that
> auto-dismisses after five seconds tells the user the work finished when it
> has not.

---

## 🔁 The normal API is unchanged

**When no `preset` is given, nothing changes.** Every existing call renders
exactly as it did before, with the same type icon and no icon animation:

```php
ToastMagic::success('Successfully Created');

ToastMagic::info('Info!', 'Your data has been saved!');
ToastMagic::error('Error!', 'Your data has been saved!');
ToastMagic::warning('Warning!', 'Your data has been saved!');

ToastMagic::success('Success!', 'Your data has been saved!');

ToastMagic::info('New message', 'Hey, are you free to chat?', [
    'avatar' => 'https://example.com/avatar.jpg',
]);
```

`preset` is purely additive and opt-in. It has no default value, there is no
global config switch that turns presets on for every toast, and upgrading does
not change the appearance of any existing call. The four type icons are
untouched — presets ship their own icon set alongside them.

### `preset` and `avatar` together

`avatar` already replaces the type icon with an image. When both are supplied,
**`avatar` wins** and the preset's icon and animation are skipped:

```php
// Renders the avatar image. 'cart-add' is ignored.
ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'avatar' => '/img/product-42.png',
    'preset' => 'cart-add',
]);
```

A rejected avatar URL falls back to the **preset** icon when a preset is set,
and to the type icon otherwise.

---

## ⚠️ Unknown or invalid presets

An unrecognised preset is **ignored silently**. The toast still renders — with
its normal type icon and no icon animation — exactly as if `preset` had not been
passed at all.

```php
// Renders a completely normal success toast.
ToastMagic::success('Added to cart', 'Nike Air Max ×1', [
    'preset' => 'cart-added',   // typo — not a registered preset
]);
```

This follows the package's existing convention for enumerated values rather than
introducing a new failure mode:

| Value | Behaviour |
|---|---|
| Unknown `type` | falls back to `info` |
| Unknown `theme` | falls back to `default` |
| Unknown `animation` | falls back to `default` |
| Unknown `positionClass` | falls back to `toast-top-end` |
| Rejected `avatar` URL | falls back to the preset or type icon |
| **Unknown `preset`** | **falls back to the type icon** |

Specifically:

* **No exception is thrown** and the toast is never dropped.
* **Non-string values** (`true`, `42`, `null`, arrays, objects) are treated as
  absent.
* **Inherited property names** (`constructor`, `toString`, `__proto__`) resolve
  to nothing — the registry is read through `hasOwnProperty`.
* The value is validated **server-side against `ToastMagic::PRESETS`** before it
  is emitted, so an unregistered name never reaches the DOM as a class name.
  This is the same discipline already applied to `theme`, `animation` and
  `positionClass`.
* The runtime validates again, so presets arriving from Livewire, `data-`
  attributes or direct JavaScript calls are checked too.

> **Note:** because an invalid preset degrades silently, a typo is not reported
> at runtime. Assert against `ToastMagic::PRESETS` in tests if you build preset
> names dynamically.

---

## 🧑‍💻 Other integrations

### JavaScript

```js
toastMagic.success({
    heading: 'Added to cart',
    description: 'Nike Air Max ×1',
    preset: 'cart-add',
});
```

`preset` is an options-object key only. The positional signature
(`toastMagic.success('Heading', 'Description', …)`) is frozen for backward
compatibility and gains no new parameter.

### Livewire (v3 & v4)

```php
$this->dispatch('toastMagic',
    status: 'success',
    title: 'Added to cart',
    message: 'Nike Air Max ×1',
    options: [
        'preset' => 'cart-add',
    ],
);
```

### HTML data attributes

```html
<button
    data-toast-type="success"
    data-toast-preset="cart-add"
    data-toast-heading="Added to cart"
    data-toast-description="Nike Air Max ×1"
>Add to cart</button>
```

| Attribute | Purpose |
|---|---|
| `data-toast-preset` | Preset name. An unregistered name is ignored. |

---

## 🎛️ Motion notes

* **Animations start when the toast becomes visible.** Every preset animation is
  gated on the toast's `show` state rather than on insertion, so a preset still
  plays in full when `showDuration` delays the entrance.
* **Reduced motion is handled automatically.** Under
  `prefers-reduced-motion: reduce` every preset animation is neutralised along
  with the rest of the toast's motion. Icons still render in full — they simply
  do not move.
* **`shake` moves the toast content, not the toast.** `.toast-item` cannot be
  shaken: its `transform` is owned by the entrance/exit transition and its
  `translate` by the FLIP stack reflow. `shake` is applied to the inner
  `.toast-magic-relative` wrapper instead, so the progress bar — a
  pseudo-element on `.toast-item` — stays steady while the content shakes.
* **`pop-particles` is bounded.** `.toast-item` has `overflow: hidden`, so
  particle travel is capped at 10px — the toast's own padding — and a particle
  never reaches the clipping edge.
* **Presets work with every theme.** They change the icon inside the existing
  `.toast-body-icon-container` slot, so all nine themes, colour mode, gradient
  mode, dark mode and RTL are unaffected. Preset icons are stroked with
  `currentColor`, so they pick up the type accent like the built-in icons do.

---

## 🎨 Customising

### Colour

Preset icons are **multi-coloured**. Each one is painted from four CSS custom
properties rather than a single `currentColor`:

| Property | Paints |
|---|---|
| `--tm-i1` | The primary stroke — the body of the icon |
| `--tm-i2` | The accent — wheels, stripes, the filled part |
| `--tm-i3` | A secondary accent, where an icon has three parts |

Every one falls back to `currentColor`, so an icon with no palette behind it
still renders in the type accent. Each preset ships a light and a dark palette;
`neon` gets its own, since its icons sit on a dark puck in either mode.

Retint a single preset:

```css
.toast-body-icon-container.tm-preset-wishlist-add {
    --tm-i1: #9f1239;   /* outline */
    --tm-i2: #f43f5e;   /* fill    */
}
```

Match your brand across the whole set:

```css
.toast-body-icon-container.tm-preset {
    --tm-i1: var(--brand-700);
    --tm-i2: var(--brand-500);
}
```

**Prefer monochrome?** One rule puts every preset back to a single colour that
follows the toast type, exactly like the built-in icons:

```css
.toast-body-icon-container.tm-preset {
    --tm-i1: currentColor;
    --tm-i2: currentColor;
    --tm-i3: currentColor;
}
```

### Everything else

Stroke-based SVGs, so the usual SVG properties apply:

```css
/* Lighter strokes on every preset icon */
.toast-body-icon-container.tm-preset svg {
    stroke-width: 1.75;
}
```

Each preset stamps three classes on the icon container — `tm-preset`,
`tm-preset-{name}` and `tm-anim-{animation}` — so any of them can be targeted.
To drop one preset's motion without touching the others:

```css
.toast-body-icon-container.tm-preset-settings-saved .tm-icon-base {
    animation: none;
}
```

---

## 🎞️ Why not Lottie?

A reasonable question, and the answer is deliberate.

**Licensing.** Animated icon libraries are mostly not redistributable inside a
package that other people redistribute in turn. Flaticon forbids redistribution
and derivative works without express authorization. Icons8's general catalogue
restricts redistribution outside its explicitly MIT-licensed packs. Even the
Lottie Simple License, which is permissive about commercial use, does not allow
redistributing the raw animation files as standalone assets — which is exactly
what shipping JSON into every user's `public/packages/…` would be.

**Weight.** The smallest Lottie player, `lottie_light.min.js`, is 168 KB raw and
46.7 KB gzipped. This package's entire runtime is 47 KB raw and 13.8 KB gzipped,
and "zero dependencies" is its first feature bullet. The player alone would be
over three times the gzipped size of everything else, before any animation data.

**Integration.** Lottie bakes colour into the animation, so an icon would stop
following the type accent across the nine themes, dark mode and colour mode. It
also renders outside the reach of the stylesheet, so `prefers-reduced-motion`
and hover-pause would each need bespoke handling per preset.

CSS-animated stroke SVGs give up some expressiveness and get all of that back.

**If you want Lottie anyway**, keep it in your application: render your own
element and pass the toast a `preset` only for the type styling, or open an issue
— an opt-in adapter where the app supplies both the player and its own licensed
file is a reasonable addition, and would keep the package itself dependency-free.

---

## 📄 Icon credits

Preset icon geometry is [Lucide](https://lucide.dev) v1.33.0. Paths are used
unmodified except where an animation or a colour needs a part addressable on its
own — the trash lid is grouped so it can pivot, the download and upload arrows
are grouped so they travel as one, and parts are split out where the palette
paints them separately. `payment-failed` composes a card with the set's own
`-off` diagonal, since Lucide has no `credit-card-off`. The colour palettes and
the animations are this package's own.

> **Lucide** — ISC License, Copyright © 2026 Lucide Icons and Contributors.
> `check`, `download`, `upload` and `trash-2` derive from
> [Feather](https://feathericons.com) — MIT License, Copyright © 2013–present
> Cole Bemis.

Both licences permit redistribution, which is what makes them safe to ship
inside an MIT package. The four original type icons (`success`, `error`,
`warning`, `info`) are unchanged and are not from Lucide.
