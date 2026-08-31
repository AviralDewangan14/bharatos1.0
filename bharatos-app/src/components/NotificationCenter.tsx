import { useEffect  } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { X, BellOff, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function NotificationCenter() {
  const { notifications, drawerOpen, dismissNotification, clearAll } = useNotificationStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        dismissNotification(notifications[0].id);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle size={18} className="text-[#2ecc71]" />;
      case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />;
      case 'error': return <XCircle size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-blue-400" />;
    }
  };

  return (
    <>
      {/* Toast Area */}
      <div className="fixed top-4 right-4 z-[150] flex flex-col gap-2 pointer-events-none">
        {notifications.slice(0, 3).map(notif => (
          <div key={notif.id} className="w-80 bg-gray-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl pointer-events-auto flex gap-3 animate-in slide-in-from-right-8 fade-in">
            <div className="mt-0.5">{getIcon(notif.type || 'info')}</div>
            <div className="flex-1">
              <h4 className="text-gray-100 text-sm font-semibold">{notif.title}</h4>
              <p className="text-gray-400 text-xs mt-1 leading-snug">{notif.message}</p>
            </div>
            <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white self-start">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-[120] flex flex-col mb-[48px] animate-in slide-in-from-right-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-medium flex items-center gap-2">
              Notification Center
            </h3>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-xs text-[#d4722a] hover:text-white transition-colors">
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                <BellOff size={32} />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="bg-white/5 border border-white/5 p-3 rounded-lg flex gap-3 group hover:bg-white/10 transition-colors">
                  <div className="mt-0.5">{getIcon(notif.type || 'info')}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-gray-200 text-sm font-medium">{notif.title}</h4>
                      <span className="text-[10px] text-gray-500">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                  </div>
                  <button onClick={() => dismissNotification(notif.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity self-center">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
