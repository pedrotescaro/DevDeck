import { redirect } from 'next/navigation';

export const revalidate = 0;

export default function DuckyPage() {
  redirect('/async');
}
