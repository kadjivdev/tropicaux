import { Head, Link } from '@inertiajs/react';
import logo from "../../../public/fichiers/images/logo.png";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Accueil" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" >
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" command="--toggle" commandfor="mobile-menu" className="relative inline-flex items-center text-success justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6 in-aria-expanded:hidden">
                                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6 not-in-aria-expanded:hidden">
                                    <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                                <img src={logo} alt="E-School" className="img-fluid " style={{ width: "100px" }} />
                            </div>
                            <div className="hidden py-2 sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <a href="#" aria-current="page" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"><i class="bi bi-houses"></i> Accueil</a>
                                    <a href="#banner" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> A Propos</a>
                                    <a href="#partners" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> Partenaires</a>
                                    <a href="#newsletter" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-person-lines-fill"></i> Contact</a>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute inset-y-0 right-0 flex space-x-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {!auth.user ? (
                                <>
                                    <Link href="/login" className="btn btn-sm rounded-md shadow-sm border bg-success text-white bg-hover">
                                        <i className="bi bi-person-lock"></i> Connexion
                                    </Link>
                                    <Link href="/register" className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                        <i className="bi bi-person-plus"></i> Créer un compte
                                    </Link>
                                </>
                            ) : (
                                <Link href="/dashboard" className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                    <i className="bi bi-house-up"></i> Tableau de board
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <el-disclosure id="mobile-menu" hidden class="block sm:hidden">
                    <div class="space-y-1 px-2 pt-2 pb-3">
                        {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-white/5 hover:text-white" --> */}
                        <a href="#" aria-current="page" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"><i class="bi bi-houses"></i> Accueil</a>
                        <a href="#banner" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> A Propos</a>
                        <a href="#partners" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> Partenaires</a>
                        <a href="#newsletter" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-person-lines-fill"></i> Contact</a>
                        {!auth.user ? (
                            <>
                                <Link href="/login" className="btn btn-sm rounded-md shadow-sm border bg-success text-white bg-hover">
                                    <i className="bi bi-person-lock"></i> Connexion
                                </Link>
                                <Link href="/register" className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                    <i className="bi bi-person-plus"></i> Créer un compte
                                </Link>
                            </>
                        ) : (
                            <Link href="/dashboard" className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                <i className="bi bi-house-up"></i> Tableau de board
                            </Link>
                        )}
                    </div>
                </el-disclosure>
            </nav>


            {/* <!-- footer --> */}
            <div class="row section bg-light shadow-sm p-3  px-0 mx-0 align-center" id='footer'>
                <div className="col-md-12">
                    <p style={{ fontSize: "12px" }} className="text-center">@Copyright <strong class="badge bg-light text-success border">{new Date().getFullYear()}</strong> | Tous droits réservés</p>
                </div>
            </div>
        </>
    );
}
