'use client'
import Script from 'next/script'
import React from 'react'

const Whatsapp = () => {
  return (
    <div>

      <Script
        id="whatsapp-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        (function (w, d, s, u) {
            w.gbwawc = {
                url: u,
                options: {
                    waId: "15557880450",
                    siteName: "Secunderabad Relay Helpline",
                    siteTag: "ASHARA MUBARAKA 1447H",
                    siteLogo: "https://files.gallabox.com/684fc5473e5cf994a69d1d30/3560b3a8-67c0-466c-842c-9a1639edbb8c-SECUNDERADRELAYCENTRE1.png",
                    widgetPosition: "RIGHT",
                    welcomeMessage: "AFZAL US SALAM",
                    brandColor: "#25D366",
                    messageText: "PLEASE ENTER YOUR QUERY",
                    replyOptions: [],
                    version: "v1",
                    widgetPositionMarginX: 12,
                    widgetPositionMarginY: 12,
                },
            };
            var h = d.getElementsByTagName(s)[0],
                j = d.createElement(s);
            j.async = true;
            j.src = u + "/whatsapp-widget.min.js?_=" + "2025-06-16 20";
            h.parentNode.insertBefore(j, h);
        })(window, document, "script", "https://waw.gallabox.com");
        `,
        }}
      />
    </div>
  )
}

export default Whatsapp
