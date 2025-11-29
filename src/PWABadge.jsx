import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  // cek update setiap 1 jam
  const period = 60 * 60 * 1000
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          /** @type {ServiceWorker} */
          const sw = e.target
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 z-50" role="alert" aria-labelledby="toast-message">
      {(offlineReady || needRefresh) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px] max-w-md">
          <div className="mb-3">
            {offlineReady ? (
              <span id="toast-message" className="text-sm text-gray-700">
                Aplikasi siap digunakan offline
              </span>
            ) : (
              <span id="toast-message" className="text-sm text-gray-700 font-medium">
                Versi baru tersedia! Klik Reload untuk memperbarui.
              </span>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            {needRefresh && (
              <button
                className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
            )}
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => close()}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge

/**
 * Fungsi ini akan mendaftarkan pengecekan sinkronisasi berkala setiap jam.
 * @param period {number}
 * @param swUrl {string}
 * @param r {ServiceWorkerRegistration}
 */
function registerPeriodicSync(period, swUrl, r) {
  if (period <= 0) return
  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return
    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })
    if (resp?.status === 200)
      await r.update()
  }, period)
}