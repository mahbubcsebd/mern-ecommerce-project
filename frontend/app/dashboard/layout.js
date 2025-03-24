
const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="z-40 bg-background/60 backdrop-blur-md fixed top-0 left-0 right-0 border-b ">
                <div className="container flex h-20 items-center justify-between py-6 ">
                    {/* <MainNav items={navLinks} /> */}
                    Dashboard Header
                </div>
            </header>
            <main className="flex-1 pt-20 flex flex-col">{children}</main>
            <footer>
                <p>this is the dashboard footer</p>
            </footer>
        </div>
    );
};
export default DashboardLayout;
