import React from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onAction?: (item: T) => void;
  actionLabel?: string;
  className?: string;
}

export function Table<T>({
  data,
  columns,
  onAction,
  actionLabel = 'Ação',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs uppercase bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-6 py-3 ${col.className ?? ''}`}>
                {col.label}
              </th>
            ))}
            {onAction && (
              <th className="px-6 py-3">
                <span className="sr-only">{actionLabel}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-6 py-4 ${col.className ?? ''}`}>
                  {col.render ? col.render(item) : String(item[col.key])}
                </td>
              ))}
              {onAction && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onAction(item)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {actionLabel}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
