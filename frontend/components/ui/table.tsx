import * as React from "react";

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className="w-full caption-bottom text-sm border-collapse"
      {...props}
    />
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <thead className="border-b border-slate-800" {...props} />;
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody {...props} />;
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/60"
      {...props}
    />
  );
}

export function TableHead(
  props: React.ThHTMLAttributes<HTMLTableCellElement>
) {
  return (
    <th
      className="px-4 py-2 text-left text-xs font-medium text-slate-400"
      {...props}
    />
  );
}

export function TableCell(
  props: React.TdHTMLAttributes<HTMLTableCellElement>
) {
  return (
    <td className="px-4 py-2 align-middle text-sm text-slate-100" {...props} />
  );
}

