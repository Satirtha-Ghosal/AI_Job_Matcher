export default function ProfileCard({info}) {
    return (
        <>
            <div className="bg-slate-200 rounded-2xl m-4 p-10">
                <h3 className="text-3xl text-cyan-900 font-bold">{info.title}</h3>
                <hr className="mt-5 mb-5" />
                <div className="grid grid-flow-row sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6">
                    {
                        info.items.map((item, index) => {
                            return (
                                <div className="flex flex-col gap-[0.5px]">
                                    <h5 className="text-gray-600 text-[16px]">{item.title}</h5>
                                    <p className="text-[25px] font-[600] text-indigo-950">{item.value}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}