import React, {useCallback, useEffect, useState} from 'react';
import io from 'socket.io-client';
import {IconContext} from "react-icons";
import {FaArrowDown, FaArrowUp, FaEquals} from "react-icons/fa";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Marquee from "react-fast-marquee";
import Countdown from "react-countdown";

function Stonks() {
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)

    const [socket, setSocket] = useState(null);
    const [stonks, setStonks] = useState(null);

    const handleInviteAccepted = useCallback((data) => {
        setStonks(data)
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const newSocket = io({
            query: {token: user.token}
        });
        setSocket(newSocket);
        newSocket.emit('stonks:get')
        newSocket.on('stonks:data', handleInviteAccepted)

        return () => newSocket.close();
    }, [setSocket, user, navigate]);

    return stonks && (<>
        <section className={'heading pb-6'}>
            <Marquee className={'bg-none'} gradient={false} speed={40}>
                <span className={'font-mono uppercase text-2xl'}>
                    {stonks.message ? stonks.message : "Welcome to stock bar"}
                </span>
            </Marquee>
        </section>
        <div className={'min-w-full text-2xl'}>
            <div className={'grid grid-cols-3 gap-2 uppercase font-mono text-white'}>
                {Object.entries(stonks.categories)
                    .map(([_, category]) =>
                        <div className={'grid grid-cols-1 px-3 py-2 gap-2'}>
                            <div className={' pl-3'}>
                                {category.name}
                            </div>

                            <div className={'col-span-1'}>
                                <div className={'grid grid-cols-1  gap-2'}>
                                    {category.stonks.map((stonk) => (
                                        <div className={''}>
                                            <div className={'grid grid-cols-4'}>
                                                <div className={'text-right col-span-3'}>
                                                    <div className={''}>
                                                        {stonk.name.substring(0, stonk.name.length - 1)}
                                                    </div>
                                                </div>
                                                <div className={'pl-3'}>
                                                    <div>
                                                        {stonk.price} <span className={'inline-block text-sm'}>
                                                        {
                                                            {
                                                                'lower': <IconContext.Provider
                                                                    value={{size: '25px'}}
                                                                >
                                                                    <div>
                                                                        <FaArrowDown className={'fill-red-700'}/>
                                                                    </div>
                                                                </IconContext.Provider>,
                                                                'higher': <IconContext.Provider
                                                                    value={{size: '25px'}}
                                                                >
                                                                    <div>
                                                                        <FaArrowUp className={'fill-green-700'}/>
                                                                    </div>
                                                                </IconContext.Provider>,

                                                                'equal': <IconContext.Provider
                                                                    value={{size: '25px'}}
                                                                >
                                                                    <div>
                                                                        <FaEquals className={'fill-orange-400'}/>
                                                                    </div>
                                                                </IconContext.Provider>,
                                                            }[stonk.dir]
                                                        }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
        <section className={'heading py-6 '}>
            <Marquee className={'bg-none'} gradient={false} speed={40}>
                <span className={'font-mono uppercase text-2xl'}>
                    {stonks.message ? stonks.message : "Welcome to stock bar"}
                </span>
            </Marquee>
        </section>
        <div className={'text-2xl font-mono'}>
            <Countdown date={stonks.date} daysInHours={true}
                       zeroPadDays={0}/>
        </div>
    </>)
}

export default Stonks