import React, { useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import Notification from './Notification';
import { useDispatch } from 'react-redux';
import { removeNotificationByIndex } from '@/redux/slices/notificationSlice';

const NotificationsMenu: React.FC = () => {
    const dispatch = useDispatch();

    const notifications = useSelector((state) => state.notifications);

    const alignNotifications = () => {
        notifications.forEach((notification, i) => {
            const el = document.getElementById(`notification-${notification.id}`);
            if (!el) return;
            setTimeout(() => {
                el.style.transform = `translateY(-${8 * (i + 1)}rem)`;
            }, 0);
            const initZ = '1000';
            el.style.zIndex = initZ;
            setTimeout(() => {
                el.style.zIndex = (parseInt(initZ) - i).toString();
            }, 0);
        });
    };

    useEffect(() => {
        alignNotifications();
    }, [notifications]);

    return (
        <div id='NotificationsMenu'>
            {notifications.map((notification) => (
                <Notification
                    id={`notification-${notification.id}`}
                    key={notification.id}
                    message={{ ...notification }}
                    onClose={() => dispatch(removeNotificationByIndex(notification.id))}
                />
            ))}
        </div>
    );
};

export default NotificationsMenu;
