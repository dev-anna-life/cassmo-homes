export const metadata = {
  title: "Member Login - Cassmo Homes",
};

export default function LoginLayout({ children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", backgroundColor: "#e9ecef" }}>
      {children}
    </div>
  );
}
