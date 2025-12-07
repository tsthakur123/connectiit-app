
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
const getuserInfo= async()=>{
     try {
        const token = await AsyncStorage.getItem("token");
        const userinfo=await jwtDecode(token||"");
        return userinfo;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
}
export { getuserInfo };