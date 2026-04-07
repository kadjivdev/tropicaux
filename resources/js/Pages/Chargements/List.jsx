import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCart, cilCheckCircle, cilList, cilMenu, cilPencil, cilTruck, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import { useEffect, useRef, useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Select from 'react-select'
import { Textarea } from '@headlessui/react';
import DataTable from 'datatables.net-bs5';

export default function List({ chargements }) {
    const permissions = usePage().props.auth.permissions;
    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [currentChargement, setCurrentChargement] = useState(null);
    const [showCamions, setShowCamions] = useState(false);
    const [showVendus, setShowVendus] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [searchItem, setSearchItem] = useState(null);

    const statusOptions = [
        { value: 'Non vendu', label: 'Non vendu' },
        { value: 'Entièrement vendu', label: 'Entièrement vendu' },
        { value: 'Partiellement vendu', label: 'Partiellement vendu' },
    ];

    const showCamionsModal = (e, chargement) => {
        e.preventDefault();
        setCurrentChargement(chargement);
        setShowCamions(true);
    }

    const showVendusModal = (e, chargement) => {
        console.log("Current chargement ", chargement?.camions_vendus?.map(cv => cv.camion?.libelle))
        e.preventDefault();
        setCurrentChargement(chargement);
        setShowVendus(true);
    }

    const closeCamionModal = () => {
        setShowCamions(false);
    }

    const showDetailsModal = (e, chargement) => {
        console.log("Current chargement ", chargement)
        e.preventDefault();
        setCurrentChargement(chargement);
        setShowDetails(true);
    }

    const closeDetailModal = () => {
        setShowDetails(false);
    }

    const { patch, delete: destroy } = useForm({})

    const deleteChargement = (e, chargement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le chargement sera supprimé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Suppression en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                destroy(route('chargement.destroy', chargement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le chargement a été supprimé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Suppression échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    const validateChargement = (e, chargement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Ce chargement sera validé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, Valider !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Validation en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                patch(route('chargement.validate', chargement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `Le chargement a été validé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Validation échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    const tableRef = useRef(null);
    const dataTableInstance = useRef(null);

    const filteredChargements = searchItem ? chargements.data?.filter(c => c.statut === searchItem) : chargements.data;
    const totalMontant = filteredChargements?.reduce((total, chargement) => total + (chargement._total_amount || 0), 0);

    useEffect(() => {
        dataTableInstance.current = new DataTable(tableRef.current, {
            pagingType: 'full_numbers',
            responsive: true,
            dom: `
                    <'dt-top d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2'
                        <'dt-search mb-2 mb-sm-0'f>
                        <'dt-buttons text-sm-end'B>
                    >
                    <'table-responsive'tr>
                    <'d-flex flex-column flex-sm-row justify-content-between align-items-center mt-2'
                        i
                        p
                    >
            `,
            pageLength: 15,
            order: [
                [0, 'desc']
            ],
            // columns: [null, null, null, null], // ⬅ match number of <th>
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn btn-sm btn-dark',
                    text: '<i class="fas fa-copy"></i> Copier'
                },
                {
                    extend: 'excel',
                    className: 'btn btn-sm btn-success',
                    text: '<i class="fas fa-file-excel"></i> Excel'
                },
                {
                    extend: 'pdf',
                    className: 'btn btn-sm btn-danger',
                    text: '<i class="fas fa-file-pdf"></i> PDF'
                },
                {
                    extend: 'print',
                    className: 'btn btn-sm btn-warning',
                    text: '<i class="fas fa-print"></i> Imprimer'
                }
            ],
            language: {
                decimal: ",",
                thousands: " ",
                emptyTable: "Aucune donnée disponible",
                info: "Affichage de _START_ à _END_ sur _TOTAL_ lignes",
                infoEmpty: "Affichage de 0 à 0 sur 0 lignes",
                infoFiltered: "(filtré de _MAX_ lignes au total)",
                lengthMenu: "Afficher _MENU_ lignes",
                loadingRecords: "Chargement...",
                processing: "Traitement...",
                search: "Rechercher :",
                zeroRecords: "Aucun enregistrement trouvé",
                paginate: {
                    first: "<<",
                    last: ">>",
                    next: "Suivant",
                    previous: "Précédent"
                },
                aria: {
                    sortAscending: ": activer pour trier par ordre croissant",
                    sortDescending: ": activer pour trier par ordre décroissant"
                },
                buttons: {
                    copy: "Copier",
                    excel: "Exporter Excel",
                    pdf: "Exporter PDF",
                    print: "Imprimer",
                    colvis: "Visibilité colonnes"
                }
            }
        });

        return () => dataTableInstance.current?.destroy(true);
    }, []);

    useEffect(() => {
        const table = dataTableInstance.current;
        if (!table) return;

        if (searchItem) {
            table.column(5).search(`^${searchItem}$`, true, false).draw();
        } else {
            table.column(5).search('').draw();
        }
    }, [searchItem]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des chargements
                </h2>
            }
        >
            <Head title="Les chargements" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('chargement.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("chargement.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        {/* filtering */}
                        <div className="row d-flex justify-content-center mb-3">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Select
                                        placeholder="Filtrer par statut ..."
                                        className="mt-1"
                                        classNamePrefix="react-select"
                                        isClearable
                                        isSearchable
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        options={statusOptions}
                                        value={searchItem ? statusOptions.find(option => option.value === searchItem) : null}
                                        onChange={(option) => setSearchItem(option ? option.value : null)}
                                    />
                                </div>
                            </div>
                        </div>

                        <h4 className="">Montant total : <span className="badge bg-light text-success border rounded shadow">{(totalMontant || 0).toLocaleString()} FCFA</span> </h4>
                        {/* liste */}
                        <table ref={tableRef} className="table table-striped" id='chargementsTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col text-center">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Camions</th>
                                    <th scope="col">Détails</th>
                                    <th scope="col">Vendus</th>
                                    <th scope="col">Montant</th>
                                    {/* <th scope="col">Fonds Superviseurs</th> */}
                                    <th scope="col">Dépenses Superviseurs</th>
                                    <th scope="col">Dépenses Générales</th>
                                    <th scope="col">Montant final</th>
                                    <th scope="col">Produit</th>
                                    <th scope="col">Chauffeur</th>
                                    <th scope="col">Superviseur</th>
                                    <th scope="col">Magasin</th>
                                    <th scope="col">Convoyeur</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Observation</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chargements.data?.map((chargement, index) => (
                                        <tr key={chargement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!chargement.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('chargement.edit') && (
                                                                        <Link
                                                                            className="btn text-warning"
                                                                            href={route('chargement.edit', chargement.id)} // ✅ navigation via Inertia
                                                                        >
                                                                            <CIcon icon={cilPencil} /> Modifier
                                                                        </Link>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('chargement.validate') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-success"
                                                                            onClick={(e) => validateChargement(e, chargement)} // ✅ action Inertia
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} /> Valider
                                                                        </button>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('chargement.delete') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-danger"
                                                                            onClick={(e) => deleteChargement(e, chargement)} // ✅ action Inertia
                                                                        >
                                                                            <CIcon icon={cilUserX} /> Supprimer
                                                                        </button>
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ) : '---'
                                                }

                                            </td>
                                            <td className='text-center'>
                                                <span className="badge bg-light rounded text-dark rounded shadow-sm"> {chargement?.reference ?? '---'}</span>
                                            </td>
                                            <td className='text-center'>
                                                <p className="border">{chargement.camions.map((c,index) => <small className='mx-1 border text-dark' key={index}>{c.camion?.libelle}</small>)}</p>

                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    onClick={(e) => showCamionsModal(e, chargement)}
                                                >
                                                    <CIcon icon={cilTruck} />
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    href="#"
                                                    onClick={(e) => showDetailsModal(e, chargement)}
                                                >
                                                    <CIcon icon={cilList} />
                                                </button>
                                            </td>
                                            <td className='text-center'>
                                                {chargement.statut == 'Non vendu' && <span className='badge bg-danger'>Non vendu</span>}
                                                {chargement.statut == 'Entièrement vendu' && <span className='badge bg-success'>Entièrement vendu</span>}
                                                {chargement.statut == 'Partiellement vendu' && <span className='badge bg-warning'>Partiellement vendu</span>}

                                                {chargement.statut != 'Non vendu' && (<button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    onClick={(e) => showVendusModal(e, chargement)}>
                                                    <CIcon icon={cilCart} />
                                                </button>)}
                                            </td>
                                            <td><span className="badge bg-light text-danger rounded border shadow">{chargement.total_amount}</span></td>
                                            {/* <td className='text-center'>
                                                <Link
                                                    href={route("chargement.fonds", chargement.id)}
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                >
                                                    <CIcon icon={cilList} /> <strong> {chargement.total_fonds} FCFA</strong>
                                                </Link>
                                            </td> */}
                                            <td className='text-center'>
                                                <Link
                                                    href={route("chargement.depenses", chargement.id)}
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                >
                                                    <CIcon icon={cilList} /> <strong> {chargement.total_depenses} FCFA</strong>
                                                </Link>
                                            </td>
                                            <td className='text-center'><span className="badge bg-light border text-danger shadow">{chargement.total_depenses_generales} FCFA</span></td>
                                            <td className='text-center'><span className="badge bg-light border text-danger shadow">{chargement.montant_final} FCFA</span></td>
                                            <td>{chargement?.produit?.libelle ?? '---'}</td>
                                            <td>{`${chargement?.chauffeur?.raison_sociale}`}</td>
                                            <td>{`${chargement?.superviseur?.raison_sociale}`}</td>
                                            <td>{chargement?.magasin?.libelle ?? '---'}</td>
                                            <td>{`${chargement.convoyeur?.raison_sociale ?? '---'}`}</td>
                                            <td>{chargement.adresse}</td>
                                            <td>{chargement.observation}</td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.createdBy?.firstname} - ${chargement.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.validatedBy?.firstname || ''} - ${chargement.validatedBy?.lastname || ''}`}</span> </td>
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
                        <CIcon className='text-success' icon={cilTruck} /> Liste des camions du chargement <span className='badge bg-light rounded border shadow-sm text-success'>{currentChargement?.reference ?? '---'}</span>
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
                                    currentChargement?.camions.length > 0 ?
                                        currentChargement?.camions.map((data, index) => (
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
                                                        rows={1}
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

            {/* Model des  camions vendus */}
            <Modal show={showVendus} onClose={() => setShowVendus(false)}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilTruck} /> Liste des camions vendus sur le chargement <span className='badge bg-light rounded border shadow-sm text-success'>{currentChargement?.reference ?? '---'}</span>
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
                                    currentChargement?.camions_vendus?.length > 0 ?
                                        currentChargement?.camions_vendus?.map((data, index) => (
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
                                                        rows={1}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={3}>Aucun camion disponible</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={() => setShowVendus(false)}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>

            {/* Model des  details */}
            <Modal show={showDetails} onClose={closeDetailModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilList} /> Détails du chargement <span className='badge bg-light rounded border shadow-sm text-success'>{currentChargement?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Fournisseur</th>
                                    <th scope="col">Sac de Jute</th>
                                    <th scope="col">Sac PP</th>
                                    <th scope="col">Tonnage</th>
                                    <th scope="col">Prix d'achat</th>
                                </tr>
                            </thead>
                            <tbody id="lignes">
                                {
                                    currentChargement?.details.length > 0 ?
                                        currentChargement?.details.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={data.fournisseur?.raison_sociale}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.sac_jute}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.sac_pp}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.tonnage}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.prix_achat}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={6}>Aucun détail disponible </td></tr>}
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
        </AuthenticatedLayout >
    );
}