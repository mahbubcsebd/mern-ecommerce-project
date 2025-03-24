import Footer from "@/components/Footer";
import Header from "@/components/Header";

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-20 flex flex-col">{children}</main>
            <Footer />
        </div>
    );
};
export default MainLayout;
