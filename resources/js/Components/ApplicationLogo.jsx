import logo from "../../../public/fichiers/images/logo.png";

export default function ApplicationLogo(props) {

    return (
        <>
            <div className="text-center">
                <img src={logo} alt="" srcSet="" className="img-fluid" style={{width:"100px"}} />
            </div>
        </>
    );
}
