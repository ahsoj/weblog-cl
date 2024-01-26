import { Metadata } from 'next';
import ProfilePageView from '../(user)/profilePage';

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'View user profile',
};

const ProfileView = ({ params }: { params: { id: string } }) => {
  return <ProfilePageView params={params} />;
};

export default ProfileView;
