import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilFilterPhoto, cilSave } from "@coreui/icons";
import { useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function List({ apprenants, trimestre }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [showModal, setShowModal] = useState(false);
    const [currentApprenant, setCurrentApprenant] = useState(null);

    const confirmShowModal = (e, apprenant) => {
        e.preventDefault();
        setCurrentApprenant(apprenant)
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const showImg = (apprenant) => {
        Swal.fire({
            text: `Profile de : ${apprenant.parent?.firstname} - ${apprenant.parent?.lastname}`,
            imageUrl: apprenant.photo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });
    }

    const submit = (e) => {
        e.preventDefault();

        setShowModal(false);

        Swal.fire({
            icon: 'info',
            title: 'Opération en cours...',
            text: "Veuillez patienter un instant",
            allowOutsideClick: false,   // empêche de fermer en cliquant dehors
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 3000, // ⏳ 3 secondes
            timerProgressBar: true     // affiche une barre de progression
        }).then(() => {
            // Quand le timer est fini, tu peux lancer une autre alerte
            Swal.fire({
                icon: 'success',
                html: `
                            <div style="text-align: center;">
                                <p class=''>
                                    Bulletin généré avec succès ! Cliquez sur 
                                    <strong>le lien</strong> ci-dessous pour le récupérer :
                                </p>
                                <p>
                                    <a target="_blank" href="${route('generateBulletin', { trimestre: trimestre?.id, apprenant: currentApprenant?.id })}">
                                    📥 Télécharger le bulletin
                                    </a>
                                </p>
                            </div>
                        `,
                showConfirmButton: false
            })
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel de gestion des bulletins | <strong className="badge bg-light shadow-sm rounded border text-danger">{trimestre.libelle}</strong>
                </h2>
            }
        >
            <Head title="Liste des bulletins" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Parent</th>
                                    <th scope="col">Classe</th>
                                    <th scope="col">Bulletin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    apprenants.map((apprenant, index) => (
                                        <tr key={apprenant.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <img src={apprenant.photo}
                                                    onClick={() => showImg(apprenant)}
                                                    className='img-fluid img-circle shadow' srcSet=""
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }} />
                                            </td>
                                            <td><span className="badge bg-light border text-dark border">{apprenant.school?.raison_sociale}</span></td>
                                            <td>{apprenant.firstname}</td>
                                            <td>{apprenant.lastname}</td>
                                            <td>{apprenant.parent?.firstname} {apprenant.parent?.lastname}</td>
                                            <td>{apprenant.classe?.libelle} - {apprenant.serie?.libelle} </td>
                                            <td className='text-center'>
                                                {checkPermission('bulletin.imprimer') ?
                                                    (<button className="btn bg-light border rounded text-dark"
                                                        onClick={(e) => confirmShowModal(e, apprenant)}> <CIcon className='text-success' icon={cilFilterPhoto} /> </button>) : null
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onClose={closeModal}>
                <form method='get' onClick={submit}>
                    <div className="p-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Génerer le bulletin de l'apprenant : <em className='text-success'>{currentApprenant?.firstname} -  {currentApprenant?.lastname} </em>
                        </h2>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Fermer
                            </SecondaryButton>

                            <PrimaryButton className="ms-3">
                                <CIcon icon={cilSave} />  Generer maintenant
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
