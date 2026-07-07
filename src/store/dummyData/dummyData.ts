export const dummyUsers = Array.from({ length: 10 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  phone: `+1 (123) 456-78${i}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
}));

export const dummyMessages = (userId: string) =>
  Array.from({ length: Math.floor(Math.random() * 20) + 3 }, (_, i) => ({
    id: `msg-${i + 1}`,
    sender: i % 2 === 0,
    text: `Message ${i + 1} from ${i % 2 === 0 ? userId : 'You'}`,
    timestamp: `10:${i} AM`,
    read: true,
  }));
