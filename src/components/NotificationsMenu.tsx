import React, { useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import Notification from './Notification';
import { useDispatch } from 'react-redux';
import { removeNotificationByIndex } from '@/redux/slices/notificationSlice';

const NotificationsMenu: React.FC = () => {
    const dispatch = useDispatch();

    // TODO: Fix this

    const notifications = useSelector((state) => state.notifications);

    const alignNotifications = () => {
        console.log(notifications);
        notifications.forEach((notification, i) => {
            const el = document.getElementById(`notification-${notification.id}`);
            if (!el) return;
            setTimeout(() => {
                el.style.transform = `translateY(-${8 * (i + 1)}rem)`;
            }, 0);
            el.style.zIndex = (-i).toString();
        });
    };

    useEffect(() => {
        alignNotifications();
    }, [notifications]);

    const handleClose = (id: number) => {
        const el = document.getElementById(`notification-${id}`);
        if (el) {
            el.style.transform = `translateY(0)`;
            setTimeout(() => {
                dispatch(removeNotificationByIndex(id));
            }, 200);
        } else {
            dispatch(removeNotificationByIndex(id));
        }
        alignNotifications();
    };

    return (
        <div id='NotificationsMenu'>
            {notifications.map((notification) => (
                <Notification
                    id={`notification-${notification.id}`}
                    key={notification.id}
                    open
                    message={{ ...notification }}
                    onClose={() => handleClose(notification.id)}
                    custom
                    className={'-bottom-28'}
                />
            ))}
        </div>
    );
};

export default NotificationsMenu;
