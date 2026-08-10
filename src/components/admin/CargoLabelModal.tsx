'use client';

import React, { useState, useRef } from 'react';
import { X, Printer, Truck, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { CustomerOrder } from '@/lib/types/ecommerce';

interface CargoLabelModalProps {
  orders: CustomerOrder[];
  isOpen: boolean;
  onClose: () => void;
}

type PaperSize = 'A6' | 'A5' | 'A4';

const PAPER_SIZES: { id: PaperSize; label: string; desc: string; width: string; height: string }[] = [
  { id: 'A6', label: 'A6', desc: '105 × 148 mm', width: '105mm', height: '148mm' },
  { id: 'A5', label: 'A5', desc: '148 × 210 mm', width: '148mm', height: '210mm' },
  { id: 'A4', label: 'A4', desc: '210 × 297 mm', width: '210mm', height: '297mm' },
];

export default function CargoLabelModal({ orders, isOpen, onClose }: CargoLabelModalProps) {
  const [paperSize, setPaperSize] = useState<PaperSize>('A6');
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !orders || orders.length === 0) return null;

  const selectedSize = PAPER_SIZES.find((s) => s.id === paperSize)!;

  // --- Print ---
  const handlePrint = () => {
    const styleId = 'cargo-print-style';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        body > * { display: none !important; }
        #cargo-printable-area { display: block !important; }
        @page { size: ${selectedSize.width} ${selectedSize.height}; margin: 4mm; }
        .cargo-label-page { page-break-after: always; break-after: page; width: 100%; box-sizing: border-box; }
        .cargo-label-page:last-child { page-break-after: avoid; }
        .print-no-shadow { box-shadow: none !important; }
      }
      #cargo-printable-area { display: none; }
    `;
    const area = document.getElementById('cargo-printable-area');
    if (area) area.style.display = 'block';
    window.print();
    setTimeout(() => {
      if (area) area.style.display = 'none';
    }, 1500);
  };

  // --- PDF (via print dialog with PDF save) ---
  const handleSavePDF = () => {
    handlePrint();
  };

  // --- Excel ---
  const handleExportExcel = () => {
    const rows = [
      ['Sipariş No', 'Müşteri Adı', 'Telefon', 'E-Posta', 'Adres', 'İlçe', 'Şehir', 'Ürünler', 'Tutar', 'Ödeme', 'Kargo Firması', 'Takip No'],
      ...orders.map((ord) => [
        ord.orderNumber,
        ord.customerName,
        ord.phone || '',
        ord.email || '',
        ord.address?.fullAddress || '',
        ord.address?.district || '',
        ord.address?.city || '',
        ord.items.map((i) => `${i.quantity}x ${i.productName}`).join('; '),
        `₺${ord.total.toLocaleString('tr-TR')}`,
        ord.paymentMethod || '',
        (ord as any).cargoCompany || 'Yurtiçi Kargo',
        ord.trackingCode || `VR-${ord.orderNumber.replace(/[^0-9]/g, '')}`,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vera-kargo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="bg-[#1C1B1A] text-[#F8F5EF] w-full max-w-5xl shadow-2xl my-8 border border-[#2A2825] rounded-lg overflow-hidden">

          {/* ─── Control Bar ─── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#2A2825] print:hidden">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#B49A6A]" />
              <h2 className="font-serif text-lg font-semibold text-[#F8F5EF]">
                Kargo Etiketi — {orders.length} Sipariş
              </h2>
            </div>

            {/* Paper Size Selector */}
            <div className="flex items-center gap-2 bg-[#242321] border border-[#3A3835] rounded px-3 py-1.5 flex-wrap">
              <span className="text-[11px] text-[#8C857B] uppercase tracking-wider font-semibold shrink-0">Kağıt:</span>
              {PAPER_SIZES.map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setPaperSize(sz.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    paperSize === sz.id
                      ? 'bg-[#B49A6A] text-[#1C1B1A]'
                      : 'text-[#8C857B] hover:text-[#F8F5EF]'
                  }`}
                >
                  {sz.label}
                  <span className="text-[9px] ml-1 opacity-70">{sz.desc}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#B49A6A] text-xs font-semibold hover:border-[#B49A6A] transition-colors rounded"
                title="CSV / Excel olarak indir"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel / CSV</span>
              </button>
              <button
                onClick={handleSavePDF}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] text-xs font-semibold hover:border-[#B49A6A] transition-colors rounded"
                title="PDF olarak kaydet"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Kaydet</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors rounded shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır ({selectedSize.label})</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#8C857B] hover:text-[#F8F5EF] hover:bg-[#242321] transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ─── Preview Area ─── */}
          <div className="p-6 overflow-y-auto max-h-[70vh] bg-[#171615]" ref={printRef}>
            <div className="flex flex-col items-center gap-6">
              {orders.map((ord, idx) => (
                <LabelCard key={ord.id || idx} ord={ord} paperSize={paperSize} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hidden Printable Area (rendered outside modal for clean print) ─── */}
      <div
        id="cargo-printable-area"
        style={{ display: 'none', fontFamily: 'Arial, sans-serif' }}
      >
        {orders.map((ord, idx) => (
          <div key={ord.id || idx} className="cargo-label-page" style={{ padding: '4mm' }}>
            <PrintLabel ord={ord} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Preview Label Card ─── */
function LabelCard({ ord, paperSize }: { ord: CustomerOrder; paperSize: PaperSize }) {
  const widthMap: Record<PaperSize, string> = { A6: '280px', A5: '360px', A4: '480px' };
  const width = widthMap[paperSize];

  return (
    <div
      style={{ width, fontFamily: 'Arial, sans-serif' }}
      className="bg-white text-[#1a1a1a] border border-gray-300 shadow-xl rounded-sm overflow-hidden"
    >
      <PrintLabel ord={ord} />
    </div>
  );
}

/* ─── Shared Label Content (used in both Preview and Printable Area) ─── */
function PrintLabel({ ord }: { ord: CustomerOrder }) {
  const trackingNo = ord.trackingCode || `VR-${ord.orderNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div style={{ padding: '8px', backgroundColor: '#fff', color: '#111', fontSize: '9px', lineHeight: '1.35' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #111', paddingBottom: '5px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src="/logo.png" alt="Vera Eşarp" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>VERA EŞARP</div>
            <div style={{ fontSize: '7px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase' }}>Kargo Sevkiyat Etiketi</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ backgroundColor: '#111', color: '#fff', fontSize: '8px', fontWeight: 'bold', padding: '2px 6px', letterSpacing: '1px', display: 'inline-block' }}>
            {(ord as any).cargoCompany || 'YURTİÇİ KARGO'}
          </div>
          <div style={{ fontSize: '8px', fontWeight: 'bold', marginTop: '2px' }}>SİPARİŞ: {ord.orderNumber}</div>
          <div style={{ fontSize: '7px', color: '#666' }}>Tarih: {ord.createdAt}</div>
        </div>
      </div>

      {/* ── Sender & Receiver ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '5px' }}>
        {/* Sender */}
        <div style={{ backgroundColor: '#f5f3ef', border: '1px solid #ccc', padding: '5px', borderRadius: '2px' }}>
          <div style={{ fontSize: '7px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ddd', paddingBottom: '2px', marginBottom: '3px' }}>
            GÖNDERİCİ
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '8px' }}>Vera Eşarp Tekstil A.Ş.</div>
          <div style={{ color: '#444', fontSize: '7.5px' }}>Lalapaşa Mah. Pelit Meydanı Cad. No:14</div>
          <div style={{ fontWeight: 'bold', fontSize: '7.5px' }}>Yakutiye / ERZURUM</div>
          <div style={{ color: '#555', fontSize: '7px' }}>Tel: +90 (534) 490 25 57</div>
        </div>

        {/* Receiver */}
        <div style={{ backgroundColor: '#fff', border: '2px solid #111', padding: '5px', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '2px', marginBottom: '3px' }}>
            <span style={{ fontSize: '7px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>ALICI</span>
            <span style={{ fontSize: '7px', fontWeight: 'bold', backgroundColor: '#111', color: '#fff', padding: '0 4px' }}>TESLİMAT</span>
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase' }}>{ord.customerName}</div>
          <div style={{ fontSize: '7.5px', color: '#333', marginTop: '2px' }}>{ord.address?.fullAddress}</div>
          <div style={{ fontWeight: 'bold', fontSize: '8px', marginTop: '2px', textTransform: 'uppercase' }}>
            {ord.address?.district} / {ord.address?.city}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '8px', marginTop: '3px' }}>📱 {ord.phone}</div>
          <div style={{ fontSize: '7px', color: '#555' }}>✉ {ord.email}</div>
        </div>
      </div>

      {/* ── Items & Payment ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '5px', marginBottom: '5px' }}>
        <div style={{ border: '1px solid #ccc', padding: '5px', backgroundColor: '#fafafa' }}>
          <div style={{ fontSize: '7px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: '3px' }}>
            📦 İÇERİK ({ord.items.length} KALEM)
          </div>
          {ord.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', borderTop: i > 0 ? '1px solid #eee' : 'none', paddingTop: i > 0 ? '2px' : '0', marginTop: i > 0 ? '2px' : '0' }}>
              <span>{item.quantity}x {item.productName}{item.color ? ` (${item.color})` : ''}</span>
              <span style={{ fontWeight: 'bold', color: '#B49A6A' }}>₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
            </div>
          ))}
        </div>
        <div style={{ border: '1px solid #ccc', padding: '5px', backgroundColor: '#fff', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '7px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>ÖDEME</div>
            <div style={{ fontSize: '7.5px', fontWeight: 'bold', color: '#16a34a', marginTop: '1px' }}>ALINDI</div>
            <div style={{ fontSize: '7px', color: '#555' }}>{ord.paymentMethod}</div>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '3px', marginTop: '3px' }}>
            <div style={{ fontSize: '7px', color: '#888' }}>TOPLAM</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>₺{ord.total.toLocaleString('tr-TR')}</div>
          </div>
        </div>
      </div>

      {/* ── Barcode Footer ── */}
      <div style={{ borderTop: '2px solid #111', paddingTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '22px', height: '22px', backgroundColor: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', borderRadius: '2px' }}>V</div>
          <div>
            <div style={{ fontSize: '7px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>TAKİP NO</div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', fontFamily: 'monospace' }}>{trackingNo}</div>
          </div>
        </div>
        {/* Simulated Barcode */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '22px', gap: '0.5px' }}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i % 4 === 0 ? '2px' : i % 3 === 0 ? '1.5px' : '1px',
                  height: i % 5 === 0 ? '100%' : i % 3 === 0 ? '80%' : '65%',
                  backgroundColor: '#111',
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: '6px', fontFamily: 'monospace', letterSpacing: '1px', marginTop: '1px', fontWeight: 'bold' }}>
            *{ord.orderNumber}*
          </div>
        </div>
      </div>
    </div>
  );
}
