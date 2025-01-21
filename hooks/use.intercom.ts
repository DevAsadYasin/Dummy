import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
    attachEvent?: (event: string, listener: EventListener) => boolean;
  }
}

export function useIntercom() {
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.intercomSettings = {
        app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
      };

      (function(){
        var w = window as any;
        var ic = w.Intercom;
        if(typeof ic === "function"){
          ic('reattach_activator');
          ic('update', w.intercomSettings);
        } else {
          var d = document;
          var i = function(){
            (i as any).c(arguments);
          };
          (i as any).q = [];
          (i as any).c = function(args: any){ (i as any).q.push(args); };
          w.Intercom = i;
          var l = function(){
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://widget.intercom.io/widget/' + process.env.NEXT_PUBLIC_INTERCOM_APP_ID;
            var x = d.getElementsByTagName('script')[0];
            x.parentNode!.insertBefore(s, x);
          };
          if(d.readyState === 'complete'){
            l();
          } else if(w.attachEvent){
            w.attachEvent('onload', l);
          } else {
            w.addEventListener('load', l, false);
          }
        }
      })();
    }
  }, [])

  useEffect(() => {
    if (user && window.Intercom) {
      window.Intercom('update', {
        name: user.username,
        email: user.email,
        created_at: Math.floor(new Date(user.created_at).getTime() / 1000),
        user_id: user.id,
        user_hash: user.intercom_hash
      });
    }
  }, [user])

  return {
    show: () => window.Intercom?.('show'),
    hide: () => window.Intercom?.('hide'),
    shutdown: () => window.Intercom?.('shutdown')
  }
}

