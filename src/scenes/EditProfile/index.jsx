import { useParams } from "react-router-dom";
import RegisterForm from "scenes/loginPage/RegisterForm";

function EditProfile() {
  const { userId } = useParams();
  return (
    <div>
      <RegisterForm userId={userId} />
    </div>
  );
}

export default EditProfile;
