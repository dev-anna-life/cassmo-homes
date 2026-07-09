export const metadata = {
  title: "Member Login — Cassmo Homes",
};

export default function LoginLayout({ children }) {
  // Fixed overlay to hide the main site Navbar/Footer on the login page
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", backgroundColor: "#e9ecef" }}>
      {children}
    </div>
  );
}
