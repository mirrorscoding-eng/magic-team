"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** A4 at 96dpi. Every document page is drawn at exactly this size, then scaled for the preview. */
export const PAGE_W = 794;
export const PAGE_H = 1123;

export type Block = {
  key: string;
  node: ReactNode;
  /** Never end a page on this block (headings). */
  keep?: boolean;
  /** Blocks of one group (table rows) repeat the group's head when they continue on a new page. */
  group?: string;
};

export type FrameProps = { children?: ReactNode; page: number; pages: number };

type Props = {
  blocks: Block[];
  heads?: Record<string, ReactNode>;
  /** Width × height of the flowing area inside the page frame. */
  area: { width: number; height: number };
  Frame: (p: FrameProps) => ReactNode;
  /** Full pages before / after the flowing ones (covers). They receive their page number. */
  before?: ((p: FrameProps) => ReactNode)[];
  after?: ((p: FrameProps) => ReactNode)[];
  /** Font, colour and direction shared by the pages and the measuring box. */
  rootClass?: string;
  rootStyle?: CSSProperties;
  dir: "rtl" | "ltr";
  /** Changes whenever the content does, so pages are re-measured. */
  version: string;
};

type Page = { items: { b: Block; head: boolean }[] };

/**
 * Lays blocks onto A4 pages: each block is measured off-screen, then packed greedily so nothing
 * is cut between pages. Tables are passed as one block per row so they break cleanly.
 */
export function Paged({ blocks, heads = {}, area, Frame, before = [], after = [], rootClass = "", rootStyle, dir, version }: Props) {
  const measure = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<Page[]>([{ items: blocks.map((b) => ({ b, head: false })) }]);

  useLayoutEffect(() => {
    let alive = true;
    const run = () => {
      const box = measure.current;
      if (!box || !alive) return;
      // offsetHeight: layout size, unaffected by the preview's scale transform
      const h = (k: string) => box.querySelector<HTMLElement>(`[data-m="${CSS.escape(k)}"]`)?.offsetHeight ?? 0;
      // a little slack: the PDF renderer can lay text out a touch taller than the screen
      const limit = area.height - 10;
      const out: Page[] = [];
      let cur: Page = { items: [] };
      let used = 0;
      const flush = () => {
        if (cur.items.length) out.push(cur);
        cur = { items: [] };
        used = 0;
      };
      blocks.forEach((b, i) => {
        const prev = blocks[i - 1];
        const cont = !!b.group && prev?.group === b.group && !!heads[b.group];
        let need = h(b.key);
        const next = blocks[i + 1];
        if (b.keep && next) need += h(next.key);
        if (cur.items.length && used + need > limit) flush();
        // a continued table also needs room for its repeated head
        if (!cur.items.length && cont) {
          cur.items.push({ b: { key: `head-${b.group}-${i}`, node: heads[b.group!] }, head: true });
          used += h(`head:${b.group}`);
        }
        cur.items.push({ b, head: false });
        used += h(b.key);
      });
      flush();
      setPages(out.length ? out : [{ items: [] }]);
    };
    run();
    // fonts change line heights: measure again once they are in
    document.fonts?.ready.then(run);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, area.width, area.height]);

  const total = before.length + pages.length + after.length;
  const pageCls = `doc-page relative overflow-hidden ${rootClass}`;
  const pageStyle: CSSProperties = { width: PAGE_W, height: PAGE_H, ...rootStyle };

  return (
    <>
      <div ref={measure} aria-hidden dir={dir} className={rootClass} style={{ ...rootStyle, position: "fixed", top: 0, left: -20000, width: area.width, visibility: "hidden", pointerEvents: "none" }}>
        {blocks.map((b) => (
          <div key={b.key} data-m={b.key} style={{ display: "flow-root" }}>
            {b.node}
          </div>
        ))}
        {Object.entries(heads).map(([g, node]) => (
          <div key={g} data-m={`head:${g}`} style={{ display: "flow-root" }}>
            {node}
          </div>
        ))}
      </div>
      {before.map((F, i) => (
        <div key={`b${i}`} dir={dir} className={pageCls} style={pageStyle}>
          {F({ page: i + 1, pages: total })}
        </div>
      ))}
      {pages.map((p, i) => (
        <div key={`p${i}`} dir={dir} className={pageCls} style={pageStyle}>
          {Frame({
            page: before.length + i + 1,
            pages: total,
            children: p.items.map(({ b }) => (
              <div key={b.key} style={{ display: "flow-root" }}>
                {b.node}
              </div>
            )),
          })}
        </div>
      ))}
      {after.map((F, i) => (
        <div key={`a${i}`} dir={dir} className={pageCls} style={pageStyle}>
          {F({ page: before.length + pages.length + i + 1, pages: total })}
        </div>
      ))}
    </>
  );
}
