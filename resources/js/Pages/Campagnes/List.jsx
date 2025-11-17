import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibBuffer, cilList, cilPen, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';
import TextInput from '@/Components/TextInput';
import TextTruncate from '@/Components/TextTruncate';
import { useState } from 'react';

export default function List({ campagnes }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [elements, setElements] = useState(campagnes.data)
    const [allElements, setAllElements] = useState(campagnes.data); // backup

    const { get } = useForm({})

    const exploreCampagne = (e, c) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Explorer la campagne ?</span>',
            text: `Exploration de la Campagne : ${c.libelle}`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, Valider !',
            cancelButtonText: 'Annuler'
        }).then((result) => {

            if (!result.isConfirmed) return;

            Swal.fire({
                title: '<span style="color: #facc15;">🫠 Exploration en cours</span>',
                text: 'Veuillez patienter...',
                allowOutsideClick: false,
                didOpen: Swal.showLoading,
            });

            // 1️⃣ Définition de la session campagne
            get(route("campagneSession", c.id), {
                onSuccess: () => {
                    Swal.fire({
                        title: '<span style="color: #2a7348;">Session créée !</span>',
                        allowOutsideClick: false,
                        didOpen: Swal.showLoading,
                    });

                    // 2️⃣ Redirection vers le dashboard
                    get(route("dashboard"), {
                        onSuccess: () => {
                            Swal.close();
                            Swal.fire({
                                title: '<span style="color: #2a7348;">Exploration en cours...</span>',
                                text: `Bienvenue dans la campagne : ${c.libelle}`,
                                confirmButtonText: '😇 Fermer',
                            });
                        },
                        onError: (e) => {
                            Swal.close();
                            Swal.fire({
                                title: '<span style="color: #facc15;">🤦‍♂️ Erreur Dashboard</span>',
                                text: e.exception ?? "Veuillez réessayer.",
                            });
                        }
                    });
                },

                onError: (e) => {
                    Swal.close();
                    Swal.fire({
                        title: '<span style="color: #facc15;">🤦‍♂️ Erreur génération session</span>',
                        text: e.exception ?? "Veuillez réessayer.",
                    });
                }
            });
        });
    };

    // handle searching....
    const handleSearch = (text) => {
        if (!text) {
            setElements(allElements);
            return;
        }

        const newElements = allElements.filter((el) =>
            (el.libelle.toLowerCase().includes(text.toLowerCase()) || el.description.toLowerCase().includes(text.toLowerCase()))
        );

        setElements(newElements);
    };

    return (
        <AuthenticatedLayout
            menu={false}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des campagnes
                </h2>
            }
        >
            <Head title="Les Campagnes" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('financement.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("campagne.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        {/*  */}
                        <div className="row d-flex justify-content-center">
                            <div className="col-8">
                                <TextInput
                                    type="search"
                                    isFocused
                                    className='w-full'
                                    placeholder="Rechercher une campagne ...."
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <br />
                        <div className="row m-3">
                            {
                                elements.length > 0 ?
                                    elements.map((c) => (
                                        <div
                                            key={c.id}
                                            className="col-md-4">
                                            <div className="card shadow w-100"
                                                uk-scrollspy="cls: uk-animation-slide-top"
                                                style={{ border: '3px solid #f6f6f6', borderRadius: "20px" }} >
                                                <div className="card-body">
                                                    <h5 className="card-title text-uppercase text-center bg-light">{c.libelle}</h5>
                                                    <div className="card-text">
                                                        {
                                                            <TextTruncate
                                                                text={c.description}
                                                                limit={20} />}
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <Link className="btn w-100 btn-light bg-hover border mx-1 text-warning"
                                                            href={route("campagne.edit", c.id)}> <CIcon className='' icon={cilPencil} /> Modifier</Link>

                                                        <Link className="btn w-100 bg-success bg-hover text-white"
                                                            onClick={(e) => exploreCampagne(e, c)}> <CIcon className='' icon={cibBuffer} /> Explorer</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) :
                                    <p className="text-center text-danger">Aucun élement trouvé</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
