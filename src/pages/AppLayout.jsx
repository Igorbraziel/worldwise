import SideBar from "../components/SideBar";
import Map from "../components/Map";
import styles from "./AppLayout.module.css";
import User from "../components/User";
import { useAuth } from "../context/FakeAuthContext";

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      {user && <User />}
    </div>
  );
}

export default AppLayout;
