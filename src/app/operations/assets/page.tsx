// src/app/operations/assets/page.tsx
'use client';

import { useState } from 'react';

export default function AssetsPage() {
  const [url, setUrl] = useState<string | null>(null);

  async function upload(file: File) {
    const res = await fetch(
      `/operations/assets/upload?filename=${encodeURIComponent(file.name)}`,
      {
        method: 'POST',
        body: file,
      }
    );

    const blob = await res.json();
    setUrl(blob.url);
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Asset Upload</h1>

      <input
        type="file"
        accept="video/*,image/*"
        onChange={(e) => e.target.files && upload(e.target.files[0])}
      />

      {url && (
        <div className="text-sm">
          Uploaded:
          <a
            href={url}
            target="_blank"
            className="block break-all text-blue-400 underline"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
