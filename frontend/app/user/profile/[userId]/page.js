import Profile from "../_components/ProfilePageContent"

const ProfilePage = async ({params}) => {
    const userId = (await params).userId
  return (
    <div>
        {userId}
        <Profile userId={userId} />
    </div>
  )
}

export default ProfilePage