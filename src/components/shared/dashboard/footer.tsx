export function Footer () {
    return (
        <div className="w-full">
            <footer className=" bg-white border-t border-l border-[#E7E7E7] h-auto text-[#888888] flex items-center justify-between p-4">
                <p>© {new Date().getFullYear()} Powered by IDEAx Labs</p>
                <p className="">Version 1.1.0</p>
            </footer>
        </div>
    )
}
