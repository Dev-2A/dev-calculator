import BaseConverter from "../components/tools/BaseConverter";
import UnixTimestamp from "../components/tools/UnixTimestamp";
import ByteConverter from "../components/tools/ByteConverter";
import ColorConverter from "../components/tools/ColorConverter";
import JwtDecoder from "../components/tools/JwtDecoder";
import UrlEncoder from "../components/tools/UrlEncoder";
import Base64Encoder from "../components/tools/Base64Encoder";
import HashGenerator from "../components/tools/HashGenerator";
import JsonFormatter from "../components/tools/JsonFormatter";

export const tabs = [
  { id: "base", label: "진수 변환", icon: "🔢", component: BaseConverter },
  {
    id: "timestamp",
    label: "Unix 타임스탬프",
    icon: "🕐",
    component: UnixTimestamp,
  },
  { id: "byte", label: "바이트 변환", icon: "💾", component: ByteConverter },
  { id: "color", label: "색상 코드", icon: "🎨", component: ColorConverter },
  { id: "jwt", label: "JWT 디코더", icon: "🔑", component: JwtDecoder },
  { id: "url", label: "URL 인코더", icon: "🔗", component: UrlEncoder },
  { id: "base64", label: "Base64", icon: "📦", component: Base64Encoder },
  { id: "hash", label: "Hash 생성", icon: "🔒", component: HashGenerator },
  { id: "json", label: "JSON 정리", icon: "📋", component: JsonFormatter },
];
