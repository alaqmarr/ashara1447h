'use client'

import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PrintCardProps {
  name: string
  centreName: string
  qrId: string
}

export const PrintCard: React.FC<PrintCardProps> = ({ name, centreName, qrId }) => {
  const qrRef = useRef<HTMLDivElement | null>(null)

  const qrCode = useRef(
    new QRCodeStyling({
      width: 160,
      height: 160,
      data: `http://192.168.3.142:3000/helpline/${qrId}`,
      dotsOptions: {
        color: '#000000',
        type: 'square',
      },
      backgroundOptions: {
        color: 'transparent', // Transparent so the image shows through
      },
    })
  )

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [qrId])

  const handlePrint = async () => {
    const blob = await qrCode.current.getRawData('png');
    const reader = new FileReader();

    reader.onloadend = () => {
      const qrDataUrl = reader.result as string;

      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) return;

      // Use document.open/write/close as a workaround for the deprecated warning,
      // or use DOM manipulation after loading the window.
      printWindow.document.open();
      printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            html, body {
              width: 100%;
              height: 100%;
            }

            body {
              font-family: 'Segoe UI', sans-serif;
              background: #f9f9f9 url("/bg7.avif") no-repeat center center;
              background-size: cover;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20mm;
            }

            .qr-box {
              background: rgba(255, 255, 255, 0.92);
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              border: 1px solid #e0e0e0;
              max-width: 420px;
              width: 100%;
              margin: auto;
              text-align: center;
            }

            h1 {
              font-size: 22px;
              font-weight: 600;
              color: #222;
              margin-bottom: 10px;
              text-transform: uppercase;
            }

            .location {
              font-size: 14px;
              font-weight: 500;
              color: #666;
              margin-bottom: 16px;
            }

            .description {
              font-size: 15px;
              color: #333;
              margin-bottom: 24px;
              line-height: 1.6;
            }

            .qr-image {
              width: 180px;
              height: 180px;
              border-radius: 12px;
              object-fit: cover;
              margin-bottom: 16px;
            }

            @media print {
              body {
                background: #f9f9f9 url("/bg2.jpg") center center !important;
              }

              .qr-box {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-box">
            <h1>${name}</h1>
            <div class="location">${centreName}</div>
            <p class="description">
              For any <strong style="color: red;">assistance</strong> or <strong style="color: red;">emergency</strong>,
              please scan the QR code below to get in touch:
            </p>
            <img src="${qrDataUrl}" class="qr-image" />
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    };

    if (blob instanceof Blob) {
      reader.readAsDataURL(blob);
    }
  }



  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8 mb-10 max-w-md mx-auto"
      id={qrId}
    >
      <div id={`print-${qrId}`}>
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight mb-2 text-center uppercase">
          {name}
        </h1>

        <div className="text-sm text-gray-500 font-medium text-center mb-6">
          {centreName}
        </div>

        <p className="text-gray-700 text-center text-base leading-relaxed mb-6">
          For any <span className="font-semibold text-red-600">assistance</span> or{' '}
          <span className="font-semibold text-red-600">emergency</span>, please scan the QR code below to get in touch:
        </p>

        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
            <img
              src="/logo.svg"
              alt="QR Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div ref={qrRef} className="absolute inset-0 flex items-center justify-center" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handlePrint}
          className="px-6 py-2 text-sm font-semibold rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          Print
        </Button>
        <Link href={`/helpline/${qrId}`} className="ml-4 text-blue-600 hover:underline">
          <Button
            className="px-6 py-2 text-sm font-semibold rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            Visit Helpline
          </Button>
        </Link>
      </div>
    </div>
  )
}
