export const metadata = {
  title: "Join Cassmo Homes - Registration",
};

export default function SignupLayout({ children }) {
  // Fixed overlay to hide the main site Navbar/Footer on the signup page
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", backgroundColor: "#e9ecef" }}>
      {children}
    </div>
  );
}
