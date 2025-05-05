export function Footer () {
    return (
        <div>
            <footer className="bg-white border-t border-l border-[#E7E7E7] h-[84px] text-[#888888] flex items-center justify-between p-8 ">
                <p>© {new Date().getFullYear()} Powered by IDEAx Labs</p>
                <p className="ml-4">Version 1.1.0</p>
            </footer>
        </div>
    )
}
