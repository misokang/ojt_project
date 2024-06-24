import { createContext, useState } from 'react';

const AckContext = createContext({});
export const AckProvider = ({ children }) => {
    const [isAcked, setIsAcked] = useState(sessionStorage.getItem(`_ack`));

    return (
        <AckContext.Provider value={{ isAcked, setIsAcked }}>
            {children}
        </AckContext.Provider>
    );
};

export default AckContext;
