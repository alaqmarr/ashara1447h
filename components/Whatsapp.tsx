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
                      waId: "15557597103",
                      siteName: "SECUNDERABAD HELPLINE",
                      siteTag: "ASHARA MUBARAKA 1447H",
                      siteLogo: "https://files.gallabox.com/684e907f5110c5ace41efd28/32324426-6dc8-4000-8b17-03a61140d368-SECUNDERADRELAYCENTRE1.png",
                      widgetPosition: "RIGHT",
                      welcomeMessage: "Salaams! Welcome to Secunderabad Relay Center Helpline.",
                      brandColor: "#25D366",
                      messageText: "Please send us your query.",
                      replyOptions: [],
                      version: "v1",
                      widgetPositionMarginX: 12,
                      widgetPositionMarginY: 12,
                  },
              };
              var h = d.getElementsByTagName(s)[0],
                  j = d.createElement(s);
              j.async = true;
              j.src = u + "/whatsapp-widget.min.js?_=" + "2025-06-15 17";
              h.parentNode.insertBefore(j, h);
          })(window, document, "script", "https://waw.gallabox.com");
        `,
      }}
    />
    </div>
  )
}

export default Whatsapp
