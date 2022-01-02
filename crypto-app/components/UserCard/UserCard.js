import { useEffect, useRef, useState } from 'react';

import { isInViewport } from '../../utils';

import styles from './UserCard.module.scss'

const UserCard = () => {

    const userCard = useRef()
    const [stickCard, setStickCard] = useState(false)

    useEffect(()=>{

        window.addEventListener("scroll", manageStickyCard)

        return () => {
            window.removeEventListener("scroll", manageStickyCard)
        }

    }, [])

    function manageStickyCard(){

        var rect = userCard.current.getBoundingClientRect()
        if(rect.top <= 100){
            setStickCard(true)
        }else{
            setStickCard(false)
        }

    }

    return ( 

        <div ref={userCard}>

        <div className={`${styles["user-card"]} ${styles[stickCard ? "user-card__sticky" : ""]}`}>
            
            <div className={styles["user-card__img"]}>

            </div>

            <div className={styles["user-card__btns"]}>

                <div className={styles["user-card__subscribe"] + " btn-main"}>Suscribirse</div>
                <div className={styles["user-card__copy"] + " btn"}>Copiar</div>

            </div>

        </div>
        </div>

     );
}
 
export default UserCard;