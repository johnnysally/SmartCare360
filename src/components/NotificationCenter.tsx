import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getPatientNotifications } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = async () => {
      try {
        const data = await getPatientNotifications(user.id);
        setNotifications(data || []);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Refresh every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REGISTRATION':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CALLED':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'DELAYED':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'ROUTED':
        return <Info className="w-5 h-5 text-purple-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'REGISTRATION':
        return 'bg-green-50 border-green-200';
      case 'CALLED':
        return 'bg-blue-50 border-blue-200';
      case 'DELAYED':
        return 'bg-orange-50 border-orange-200';
      case 'ROUTED':
        return 'bg-purple-50 border-purple-200';
      case 'COMPLETED':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 ${getNotificationColor(notif.notification_type)}`}
            >
              <div className="mt-0.5">{getNotificationIcon(notif.notification_type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{notif.title}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {notif.message}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {notif.channel === 'SMS' ? '📱 SMS' : '🔔 In-App'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notif.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
