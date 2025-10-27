import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import {cilCloudDownload, cilList, cilTruck} from "@coreui/icons";
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@headlessui/react';

export default function List({ partenaire,total_amount }) {
    const permissions = usePage().props.auth.permissions;

    console.log("Le partenaire ",partenaire)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [vente, setVente] = useState(null);
    const [showCamions, setShowCamions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const showCamionsModal = (e, vente) => {
        e.preventDefault();
        setVente(vente);
        setShowCamions(true);

        console.log("Current vente",vente.camions)
    }

    const closeCamionModal = () => {
        setShowCamions(false);
    }

    const showDetailsModeModal = (e, vente) => {
        e.preventDefault();
        setVente(vente);
        setShowDetails(true);
    }

    const closeDetailModal = () => {
        setShowDetails(false);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des ventes du partenaire <span className="badge bg-light border rounded text-success">{partenaire?.raison_sociale}</span> | <span className="badge bg-light border rounded text-success">{total_amount}</span>
                </h2>
            }
        >
            <Head title="Les Ventes" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="text-center  items-center gap-4">
                            <Link className="btn w-50 bg-success bg-hover text-white" href={route("partenaire.index")}> <CIcon className='' icon={cilList} /> Liste des partenaires</Link>
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Camions</th>
                                    <th scope="col">Mode paiements</th>
                                    <th scope="col">Prix</th>
                                    <th scope="col">Poids</th>
                                    <th scope="col">Nbre Sac rejete</th>
                                    <th scope="col">Prix unit Sac rejete</th>
                                    <th scope='col'>Montant</th>
                                    <th scope='col'>Montant Total</th>
                                    <th scope='col'>Commentaire</th>
                                    <th scope='col'>Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    partenaire?.ventes.map((vente, index) => (
                                        <tr key={vente.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.reference} </span></td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    onClick={(e) => showCamionsModal(e, vente)}
                                                >
                                                    <CIcon icon={cilTruck} />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    href="#"
                                                    onClick={(e) => showDetailsModeModal(e, vente)}
                                                >
                                                    <CIcon icon={cilList} />
                                                </button>
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.prix || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.poids || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.nbre_sac_rejete || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.prix_unitaire_sac_rejete || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.montant || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.montant_total || '00'} </span></td>
                                            <td><textarea rows={1} className='form-control' disabled={true} placeholder={vente.commentaire || '--'}></textarea></td>
                                            <td>
                                                {vente.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={vente.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.createdBy?.firstname} - ${vente.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.validatedBy?.firstname || ''} - ${vente.validatedBy?.lastname || ''}`}</span> </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Model des  camions */}
            <Modal show={showCamions} onClose={closeCamionModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilTruck} /> Liste des camions de la vente <span className='badge bg-light rounded border shadow-sm text-success'>{vente?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Camion</th>
                                    <th scope="col">Commentaire</th>
                                </tr>
                            </thead>
                            <tbody id="camion">
                                {
                                    vente?.camions && vente?.camions.length > 0 ?
                                        vente?.camions.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full form-control"
                                                        value={data.camion?.libelle}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <Textarea
                                                        type="text"
                                                        className="mt-1 block w-full form-control"
                                                        value={data.commentaire}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={3}>Aucun camion disponible</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={closeCamionModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>

            {/* Model des  modes */}
            <Modal show={showDetails} onClose={closeDetailModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilList} /> Mode de paiement de la vente <span className='badge bg-light rounded border shadow-sm text-success'>{vente?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Mode de paiement</th>
                                </tr>
                            </thead>
                            <tbody id="lignes">
                                {
                                    vente?.modes && vente?.modes.length > 0 ?
                                        vente?.modes.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={data.mode?.libelle}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={2}>Aucun mode de paiement disponible </td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={closeDetailModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}