export const mockAppointments = [
    {
        id: '1',
        date: '2025-04-10',
        salon: 'Rose Life Nişantaşı',
        service: 'Manikür',
        employee: 'İrem Taş',
        price: 350,
        start: '11:00',
        end: '11:30',
        status: 'active'
    },
    {
        id: '2',
        date: '2025-04-10',
        salon: 'Rose Life Nişantaşı',
        service: 'Saç Kesimi',
        employee: 'Julide Aslan',
        price: 350,
        start: '11:30',
        end: '12:00',
        status: 'active'
    },
    {
        id: '3',
        date: '2025-04-10',
        salon: 'Rose Life Nişantaşı',
        service: 'Pedikür',
        employee: 'İrem Taş',
        price: 350,
        start: '12:00',
        end: '12:30',
        status: 'active'
    },
    {
        id: '4',
        date: '2025-04-11',
        salon: 'Blink Saasy',
        service: 'Cilt Bakımı',
        employee: 'Zeynep Koç',
        price: 400,
        start: '10:00',
        end: '11:00',
        status: 'cancelled'
    },
] as const;  