<?xml version="1.0" encoding="UTF-8"?>
<!--
  Browser-facing stylesheet for sitemap.xml. Crawlers ignore it entirely; it only
  stops browsers from showing the bare "no style information" document tree.
  Referenced by the xml-stylesheet PI that vite.config.ts writes into the sitemap.
-->
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <title>XML Sitemap — Laravel Toaster Magic</title>
        <style>
          :root {
            --brand: #FF2D20;
            --brand-strong: #E01B0C;
            --brand-soft: rgba(255, 45, 32, 0.12);
            --bg: #ffffff;
            --bg-subtle: #f7f9fb;
            --text: #10161c;
            --text-muted: #55636e;
            --text-faint: #7b8794;
            --border: #e6e9ee;
            color-scheme: light;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --brand: #FF5747;
              --brand-strong: #FF8578;
              --brand-soft: rgba(255, 87, 71, 0.14);
              --bg: #0b0f14;
              --bg-subtle: #0f151c;
              --text: #e6edf3;
              --text-muted: #9fb0bf;
              --text-faint: #6b7a89;
              --border: #1e2731;
              color-scheme: dark;
            }
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            padding: 48px 20px 80px;
            background: var(--bg);
            color: var(--text);
            font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI",
              Roboto, Helvetica, Arial, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }

          .wrap { max-width: 960px; margin: 0 auto; }

          .eyebrow {
            display: inline-block;
            margin-bottom: 14px;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--brand-soft);
            color: var(--brand-strong);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0 0 8px;
            font-size: 30px;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .lede { margin: 0 0 28px; color: var(--text-muted); }
          .lede a { color: var(--brand-strong); }

          .count { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--text); }

          .table-scroll {
            overflow-x: auto;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--bg-subtle);
          }

          table { width: 100%; border-collapse: collapse; font-size: 14px; }

          th, td {
            padding: 11px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
          }

          th {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--text-faint);
          }

          tbody tr:last-child td { border-bottom: 0; }
          tbody tr:hover td { background: var(--brand-soft); }

          td.num { color: var(--text-faint); font-variant-numeric: tabular-nums; width: 1%; }
          td.loc { white-space: normal; width: 99%; }

          td.loc a { color: var(--brand-strong); text-decoration: none; font-weight: 500; }
          td.loc a:hover { text-decoration: underline; }

          td.meta { color: var(--text-muted); font-variant-numeric: tabular-nums; }

          footer { margin-top: 24px; color: var(--text-faint); font-size: 13px; }
          footer a { color: var(--brand-strong); }
        </style>
      </head>
      <body>
        <div class="wrap">
          <span class="eyebrow">Laravel Toaster Magic</span>
          <h1>XML Sitemap</h1>
          <p class="lede">
            <span class="count"><xsl:value-of select="count(s:urlset/s:url)" /></span>
            <xsl:text> URLs for search engines. This page is a human-readable rendering of </xsl:text>
            <code>sitemap.xml</code><xsl:text> — crawlers read the raw XML.</xsl:text>
          </p>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <xsl:if test="count(s:urlset/s:url/s:lastmod) &gt; 0">
                    <th>Last modified</th>
                  </xsl:if>
                  <th>Change freq.</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="num"><xsl:value-of select="position()" /></td>
                    <td class="loc">
                      <a href="{s:loc}">
                        <xsl:value-of select="s:loc" />
                      </a>
                    </td>
                    <xsl:if test="count(/s:urlset/s:url/s:lastmod) &gt; 0">
                      <td class="meta">
                        <xsl:choose>
                          <xsl:when test="s:lastmod"><xsl:value-of select="s:lastmod" /></xsl:when>
                          <xsl:otherwise>—</xsl:otherwise>
                        </xsl:choose>
                      </td>
                    </xsl:if>
                    <td class="meta"><xsl:value-of select="s:changefreq" /></td>
                    <td class="meta"><xsl:value-of select="s:priority" /></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <a href="https://devrabiul.github.io/laravel-toaster-magic/">← Back to the documentation</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
