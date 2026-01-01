
import { useRef, useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL|| "http://localhost:3000";





const Manager = (props) => {
    const [form, setform] = useState({
        site: "",
        username: "",
        password: "",
        _id: null
    });

    const [loading, setLoading] = useState(true);

    const [password, setpassword] = useState([]);
    const [showpass, setshowpass] = useState({});
    const ref = useRef(null);
    const passwordref = useRef();
    useEffect(() => {
  const fetchPasswords = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true); // ✅ FIRST

      const res = await fetch(`${BASE_URL}/`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setpassword(data);

    } catch (err) {
      console.error("Failed to fetch passwords", err);
    } finally {
      setLoading(false); // ✅ ALWAYS runs
    }
  };

  fetchPasswords();
}, []);




    const copyText = async (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
        await navigator.clipboard.writeText(text);
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })

    }



    const handleeye = () => {

        if (ref.current.src.includes("eye.png")) {
            passwordref.current.type = "password";
            ref.current.src = "/icon/eyecross.png";
        }
        else {
            passwordref.current.type = "text";
            ref.current.src = "/icon/eye.png";
        }

    }
    const handleadd = async () => {
        if (!form.site || !form.username || !form.password) {
            toast.error("All fields are required!");
            return; // 🚪 Exit early if validation fails
        }

        if (form._id) {
            const res = await fetch(`${BASE_URL}/${form._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                },

                body: JSON.stringify({
                    site: form.site,
                    username: form.username,
                    password: form.password
                }),

            })

            const data = await res.json();

            if (data.success) {
                setpassword(password.map(p => p._id === form._id ? { ...form } : p));
                setform({ site: "", username: "", password: "", _id: null });
                toast.success("Password updated!");
            }

        }
        else {
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                },

                body: JSON.stringify(form),
            });



            const data = await res.json();
            if (data.success) {

                const updated = [...password, { ...form, _id: data.insertedId }];
                setpassword(updated);

                setform({ site: "", username: "", password: "" });
                toast('Password saved!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",

                });
            }

        }

    }

    const deletepassword = async (_id) => {
        let c = confirm("Do you want to delete password?");
        if (!c) return;

        const res = await fetch(`${BASE_URL}/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();

        if (data.success) {
            setpassword(password.filter(i => i._id !== _id));
            toast('Password deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        } else {
            toast.error("Failed to delete!");
        }
    };


    const editpassword = (_id) => {
        console.log("edit")
        const item = password.find(i => i._id === _id);
        if (!item) return;

        setform(item); // prefill form for editing

    }


    const togglePassword = (_id) => {
        setshowpass({ ...showpass, [_id]: !showpass[_id] });
    };

    return (

        <> <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"

        />

            <div className={` relative min-h-[87.2vh]  flex flex-col overflow-hidden`}>
                {props.theme ? (/* Light background */
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]    bg-[size:6rem_4rem]">
                        <div className="absolute bottom-0 left-0 right-0 top-0      bg-[radial-gradient(circle_500px_at_50%_200px,#C9FFD9,transparent)]"></div>
                    </div>

                ) : (/* Dark background */
                    <div className="absolute inset-0 -z-10 bg-slate-950 pointer-events-none">
                        <div
                            className="absolute left-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full
                   bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.2),rgba(255,255,255,0))]"
                        />
                        <div
                            className="absolute right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full
                   bg-[radial-gradient(circle_farthest-side,rgba(0,182,255,0.18),rgba(255,255,255,0))]"
                        />
                    </div>

                )}

                <div className="container  w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto  flex-grow ">
                    <div className={`heading text-2xl sm:text-3xl md:text-4xl font-bold text-center pt-2 
                ${props.theme ? "text-gray-800" : "text-gray-100"}`}>
                        <span className='text-green-500 '>&lt;</span>
                        Pass
                        <span className='text-green-500'>OP/&gt;</span>

                        <p className={`text-green-400 text-[25px] font-semibold 
                  ${props.theme ? "text-shadow-emerald-950" : "text-shadow-emerald-200"}`}>Your password Manager</p>
                    </div>

                    <div className="inputpart flex flex-col gap-4 p-4 ">

                        <input
                            name="site"
                            value={form.site} onChange={handlechange}
                            type="text"
                            placeholder="Enter Website URL"
                            className={`border-2 rounded-full px-3 py-1 focus:outline-none  transition-colors duration-300 ${props.theme ? "bg-white border-green-400 text-black placeholder-gray-600 focus:border-green-700" : "bg-transparent border-green-500 text-white placeholder-gray-400 focus:border-green-300"}`}
                        />

                        <div className='flex flex-col md:flex-row gap-4  justify-between'>
                            <input type="text" name='username' value={form.username} onChange={handlechange}
                                className={`w-full border-2 rounded-full px-3 py-1 focus:outline-none  transition-colors duration-300 ${props.theme ? "bg-white border-green-400 text-black placeholder-gray-600 focus:border-green-700" : "bg-transparent border-green-500 text-white placeholder-gray-400 focus:border-green-300"}`} placeholder='Enter Username' />
                            <div className="relative ">
                                <input ref={passwordref}
                                    type="password" name='password' value={form.password} onChange={handlechange}
                                    className={`w-full md:w-auto border-2 rounded-full px-3 py-1 focus:outline-none  transition-colors duration-300 ${props.theme ? "bg-white border-green-400 text-black placeholder-gray-600 focus:border-green-700" : "bg-transparent border-green-500 text-white placeholder-gray-400 focus:border-green-300"}`}
                                    placeholder="Enter Password"
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                    <img ref={ref} width={20} src="/icon/eyecross.png" alt="" onClick={handleeye} />
                                </span>
                            </div>
                            <div className='posit'></div>
                        </div>
                        <div className='flex justify-center '>
                            <button onClick={handleadd} className=' border border-green-900 w-fit bg-green-500 hover:bg-green-600 text-[16px] cursor-pointer font-medium px-4 py-2 rounded-full flex items-center gap-2 '>
                                <lord-icon
                                    src="https://cdn.lordicon.com/jgnvfzqg.json"
                                    trigger="hover"
                                    style={{ width: "23px", height: "23px" }}
                                >
                                </lord-icon>
                                {form._id ? "Update Password" : "Save Password"}
                            </button>
                        </div>

                    </div>

                    <h2 className={`px-5 text-[20px] font-semibold ${props.theme ? "text-black" : "text-white"
                        }`}>  Your passwords :- </h2>
                    {loading ? (
                        <div className="text-center mt-10">
                            Loading passwords...
                        </div>
                    ) :
                    password.length === 0 ? (
                        <div className={`mt-4 ml-7 ${props.theme ? "text-gray-600" : "text-white"}`}>No records found</div>
                    ) : (
                        <div className="flex justify-center md:px-6 mt-4">

                            <table className="hidden md:table table-auto w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
                                <thead className="bg-green-800 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Website</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Username</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Password</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-green-50 text-gray-800 divide-y divide-gray-200">
                                    {password.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-green-100 transition-colors">
                                            {/* Website */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-2 max-w-[300px] truncate">
                                                    <a
                                                        href={item.site}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        {item.site}
                                                    </a>
                                                    <button onClick={() => copyText(item.site)} className="cursor-pointer flex items-center justify-center w-6 h-6"  >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        ></lord-icon>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Username */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-2 max-w-[240px] truncate">
                                                    <span className="truncate">{item.username}</span>
                                                    <button onClick={() => copyText(item.username)} className="cursor-pointer flex items-center justify-center w-6 h-6" >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        ></lord-icon>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Password */}
                                            <td className="px-6 py-4 align-middle ">
                                                <div className="flex items-center gap-2 max-w-[240px] truncate password-cell">
                                                    <span className="truncate">
                                                        {showpass[item._id] ? item.password : "*".repeat(item.password.length)}
                                                    </span>
                                                    <button onClick={() => togglePassword(item._id)} className="cursor-pointer flex items-center justify-center w-6 h-6">
                                                        <img
                                                            src={showpass[item._id] ? "/icon/eye.png" : "/icon/eyecross.png"}
                                                            alt="toggle"
                                                            width={15}
                                                        />
                                                    </button>
                                                    <button onClick={() => copyText(item.password)} className="cursor-pointer flex items-center justify-center w-6 h-6"  >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        ></lord-icon>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* edit */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-3 max-w-[240px] truncate">
                                                    <button onClick={() => editpassword(item._id)} className="cursor-pointer flex items-center justify-center "  >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/gwlusjdu.json"
                                                            trigger="hover"
                                                            style={{ "width": "22px", "height": "22px" }}>
                                                        </lord-icon>
                                                    </button>
                                                    <button onClick={() => deletepassword(item._id)} className=" cursor-pointer flex items-center justify-center ">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/skkahier.json"
                                                            trigger="hover"
                                                            style={{ "width": "22px", "height": "22px" }}>
                                                        </lord-icon>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <div className="space-y-4 w-[80vw] mx-auto md:hidden">
                                {password.map((item) => (
                                    <div key={item._id} className="bg-white rounded-lg shadow-md p-4 space-y-2">
                                        <div>
                                            <span className="font-semibold text-gray-700">Website: </span>
                                            <a href={item.site} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                {item.site}
                                            </a>
                                        </div>
                                        <div><span className="font-semibold text-gray-700">Username: </span>{item.username}</div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Password: </span>
                                            {showpass[item._id] ? item.password : "*".repeat(item.password.length)}
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => togglePassword(item._id)}>
                                                <img src={showpass[item._id] ? "/icon/eye.png" : "/icon/eyecross.png"} alt="toggle" width={20} />
                                            </button>
                                            <button onClick={() => copyText(item.password)}>
                                                <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" style={{ width: 22, height: 22 }} />
                                            </button>
                                            <button onClick={() => editpassword(item._id)}>
                                                <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: 22, height: 22 }} />
                                            </button>
                                            <button onClick={() => deletepassword(item._id)}>
                                                <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: 22, height: 22 }} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                    )}


                </div>


            </div>

        </>
    )
}

export default Manager
