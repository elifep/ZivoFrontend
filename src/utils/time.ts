// utils/time.ts
export const generateTimeSlots = (start: string, end: string, durationMin: number): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (let mins = startMinutes; mins + durationMin <= endMinutes; mins += durationMin) {
        const hour = Math.floor(mins / 60).toString().padStart(2, '0');
        const minute = (mins % 60).toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
    }

    return slots;
};