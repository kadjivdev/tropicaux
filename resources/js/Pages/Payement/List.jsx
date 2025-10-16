import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { cilUserX, cilLibraryAdd, cilList, cilSave } from "@coreui/icons";

export default function List({ payements }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }
    const [showModal, setShowModal] = useState(false);
    const [currentPayement, setCurrentPayement] = useState(null);

    const { reset, setData, data, reste, errors, processing } = useForm({
        reste: null,
    })

    const confirmShowModal = (e, paiement) => {
        e.preventDefault();
        setShowModal(true);

        // console.log(paiement)
        setCurrentPayement(paiement)
    };
    const closeModal = () => {
        setShowModal(false);

        // clearErrors();
        reset();
    };


    const showPayementReceit = (paiement) => {
        Swal.fire({
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Dossier de transfert de : ${paiement.apprenant?.firstname} - ${paiement.apprenant?.lastname}`,
            imageUrl: paiement.paiement_receit,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Dossier de transfert",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }

    const generateReceit = (e) => {
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
                            Reçu généré avec succès ! Cliquez sur 
                            <strong>le lien</strong> ci-dessous pour le récupérer :
                        </p>
                        <p>
                            <a target="_blank" href="${route('paiement.generate-receit', { paiement: currentPayement?.id })}">
                            📥 Télécharger le reçu
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
                    <CIcon className='text-success' icon={cilList} /> Panel des paiements
                </h2>
            }
        >
            <Head title="Les paiements" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('paiement.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("paiement.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Apprenant</th>
                                    <th scope="col">Montant versé</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Inséré par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payements.data.map((paiement, index) => (
                                        <tr key={paiement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td><span className="badge bg-light text-dark border">  {`${paiement.school?.raison_sociale}`}</span></td>
                                            <td><span className="badge bg-light text-dark border">  {`${paiement.apprenant?.firstname} - ${paiement.apprenant?.lastname}`}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{paiement.montant}</span></td>
                                            <td>
                                                {checkPermission('paiement.imprimer.receit') ?
                                                    (<button className="btn btn-sm btn-light border shadow-sm"
                                                        onClick={(e) => confirmShowModal(e, paiement)}
                                                    >
                                                        <CIcon icon={cilUserX} />  Generer un reçu
                                                    </button>) : '--'
                                                }
                                            </td>
                                            <td>{`${paiement.createdBy?.firstname} - ${paiement.createdBy?.lastname}`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={generateReceit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Reçu pour le paiement de l'apprenant : <em className='text-success'>{currentPayement?.apprenant?.firstname} -  {currentPayement?.apprenant?.lastname} </em>
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois le reçu generé, un lien vous ai renvoyé via alert! Cliquez dessus pour télécharger le reçu.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing}>
                            <CIcon icon={cilSave} />  Generer maintenant
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
