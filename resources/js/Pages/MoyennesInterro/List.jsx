import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilFilterPhoto } from "@coreui/icons";
import { useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

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
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Profile de : ${apprenant.parent?.firstname} - ${apprenant.parent?.lastname}`,
            imageUrl: apprenant.photo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des moyennes d'interrogation | <strong className="badge bg-light shadow-sm rounded border text-danger">{trimestre.libelle}</strong>
                </h2>
            }
        >
            <Head title="Moyennes des interrogations" />

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
                                    <th scope="col">Moyennes</th>
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
                                                <button className="btn bg-light border rounded text-dark"
                                                    onClick={(e) => confirmShowModal(e, apprenant)}> <CIcon className='text-success' icon={cilFilterPhoto} />
                                                </button></td>
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
                <div className="p-3">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Liste des moyennes pour l'apprenant : <em className='text-success'>{currentApprenant?.firstname} -  {currentApprenant?.lastname} </em>
                    </h2>

                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                        {
                            currentApprenant?.matieres.length > 0 ?
                                currentApprenant?.matieres.map((matiere, index) => (
                                    <li className="nav-item" role="presentation" key={matiere.id}>
                                        <button
                                            className={`btn btn-sm _nav-link ${index === 0 ? "active" : ""}`}
                                            id={`pills-${matiere.id}-tab`}
                                            data-bs-toggle="pill"
                                            data-bs-target={`#pills-${matiere.id}`}
                                            type="button"
                                        >
                                            {matiere.libelle}
                                        </button>
                                    </li>
                                )) : (
                                    <li className='text-danger'>Aucune matière disponible!</li>
                                )
                        }

                    </ul>

                    <div className="tab-content mt-3">
                        {
                            currentApprenant?.matieres.map((matiere, index) => (
                                <div key={matiere.id} className={`tab-pane fade ${index == 0 ? 'show active' : ''}`}
                                    id={`pills-${matiere.id}`}>
                                    {/* Table Content */}

                                    <table className="border-separate border-spacing-2 border border-gray-400 dark:border-gray-500">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 dark:border-gray-600">Interrogation</th>
                                                <th className="border border-gray-300 dark:border-gray-600">Fait le</th>
                                                <th className="border border-gray-300 dark:border-gray-600">Note</th>
                                                <th className="border border-gray-300 dark:border-gray-600">Professeur</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                matiere.interrogations.data.length > 0 ?
                                                    matiere.interrogations.data.map((interro, index) => (
                                                        <tr>
                                                            <th className="border border-gray-100 dark:border-gray-700">Interro : {index + 1}</th>
                                                            <td className="border border-gray-300 dark:border-gray-700">{interro.createdAt}</td>
                                                            <td className="border border-gray-300 dark:border-gray-700">{interro.note}</td>
                                                            <td className="border border-gray-300 dark:border-gray-700">{`${interro.createdBy?.firstname} - ${interro.createdBy?.lastname}`}</td>
                                                        </tr>
                                                    )) : <tr><td colSpan={4}><small className="text-center text-danger">Aucune interrogation éffectuée</small></td></tr>
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={3}>Moyenne d'interrogation: <strong className='text-success'>{matiere.moyenne_interro}</strong> </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ))
                        }
                    </div>



                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
