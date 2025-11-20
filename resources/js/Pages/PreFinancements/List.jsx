import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCheckCircle, cilCloudDownload, cilList, cilMenu, cilPencil, cilSend, cilTruck, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from 'react-select';

export default function List({ financements, gestionnaires }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const allFinancements = financements.data
    const [_financements, setFinancements] = useState(financements.data)

    const [totalMontant, setTotalMontant] = useState(0);
    const [totalDispatch, setTotalDispatch] = useState(0);
    const [totalRetour, setTotalRetour] = useState(0);
    const [totalReste, setTotalReste] = useState(0);

    // Function to clean and convert the formatted string to a valid number
    const parseAmount = (amount) => {
        if (typeof amount === 'string') {
            // Remove spaces (thousands separator) and replace comma with dot for decimals
            return parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
        }
        return 0;
    };

    useEffect(() => {
        const montant = _financements.reduce((acc, financement) => {
            console.log("Le financement en cours :", financement);
            return acc + parseAmount(financement.montant); // On ajoute 0 si "reste" est undefined ou null
        }, 0);

        const dispatch = _financements.reduce((acc, financement) => {
            console.log("Le financement en cours :", financement);
            return acc + parseAmount(financement.montant_dispatche); // On ajoute 0 si "reste" est undefined ou null
        }, 0);


        const retour = _financements.reduce((acc, financement) => {
            console.log("Le financement en cours :", financement);
            return acc + parseAmount(financement.back_amount); // On ajoute 0 si "reste" est undefined ou null
        }, 0);

        const reste = _financements.reduce((acc, financement) => {
            console.log("Le financement en cours :", financement);
            return acc + financement.reste; // On ajoute 0 si "reste" est undefined ou null
        }, 0);

        setTotalMontant(montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 }));
        setTotalDispatch(dispatch.toLocaleString('fr-FR', { minimumFractionDigits: 2 }));
        setTotalRetour(retour.toLocaleString('fr-FR', { minimumFractionDigits: 2 }));
        setTotalReste(reste.toLocaleString('fr-FR', { minimumFractionDigits: 2 }));

    }, [_financements]); // On relance l'effet à chaque changement de _financements

    const [currentFinancement, setCurrentFinancement] = useState(null);
    const [showTransfert, setTransfert] = useState(false);

    const { data, setData, errors, processing, patch, post, delete: destroy } = useForm({
        reste: currentFinancement?.reste,
        gestionnaire_id: null
    })

    const deleteFinancement = (e, financement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le pré-financement sera supprimé de façon permanente !`,
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
                destroy(route('prefinancement.destroy', financement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le pré-financement a été supprimé avec succès.`,
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

    // validtaion des pre-financements
    const validateFinancement = (e, financement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Ce pré-financement sera validé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, valider !',
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
                patch(route('prefinancement.validate', financement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `Le pré-financement a été validé avec succès.`,
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

    // transfert du reste des pré-financements

    const closeTransfertModal = () => {
        setTransfert(false);
    }

    const transfertReste = (e, financement) => {
        e.preventDefault();

        setCurrentFinancement(financement);
        setData("reste", financement.reste)
        setTransfert(true);
    }

    const submitTransfert = (e) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le reste (${currentFinancement?.reste} FCFA) du pré-financement (${currentFinancement?.reference}) sera transféré de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, valider !',
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
                post(route('prefinancement.transfert-reste', currentFinancement?.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Transfert réussi </span>',
                            text: `Le reste (${currentFinancement?.reste} FCFA) du pré-financement (${currentFinancement?.reference}) a été transferé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });

                        setTransfert(false);
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Transfert échoué </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    // Filtrage
    const handleFiltre = (option) => {
        let newFinances = allFinancements.filter((f) => f.gestionnaire?.id == option.value)
        setFinancements(newFinances)
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des pré-financements
                </h2>
            }
        >
            <Head title="Les Pré-Financements" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('prefinancement.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("prefinancement.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        {/* filtrage via gestionnaire */}
                        <div className="row d-flex justify-content-center">
                            <div className="col-6">
                                <Select
                                    placeholder="Rechercher un gestionnaire ..."
                                    className="form-control mt-1 block w-full"
                                    options={gestionnaires.map((gestionnaire) => ({
                                        value: gestionnaire.id,
                                        label: `${gestionnaire.firstname} - ${gestionnaire.lastname}`,
                                    }))}
                                    value={gestionnaires
                                        .map((gestionnaire) => ({
                                            value: gestionnaire.id,
                                            label: `${gestionnaire.firstname} - ${gestionnaire.lastname}`,
                                        }))
                                        .find((option) => option.value === data.gestionnaire_id)} // set selected option
                                    onChange={(option) => handleFiltre(option)} // update state with id
                                />
                            </div>
                        </div>

                        <div className="border">
                            <strong className='border'>Total pré-financé: </strong>     <span className="badge mx-3 bg-dark text-light shadow border rounded">{totalMontant} FCFA</span> <br />
                            <strong className='border'>Total dispatché: </strong>     <span className="badge mx-3 bg-dark text-light shadow border rounded">{totalDispatch} FCFA</span> <br />
                            <strong className='border'>Total retourné: </strong>     <span className="badge mx-3 bg-dark text-light shadow border rounded">{totalRetour} FCFA</span> <br />
                            <strong className='border'>Total reste: </strong>     <span className="badge mx-3 bg-dark text-light shadow border rounded">{totalReste} FCFA</span>
                        </div>
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col text-center">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Gestionnaire</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Montant Dispatché</th>
                                    <th scope="col">Retours</th>
                                    <th scope="col">Reste</th>
                                    <th scope="col">Date de pré-financement</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _financements.map((financement, index) => (
                                        <tr key={financement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!financement.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('prefinancement.edit') ?
                                                                        (<Link
                                                                            className='btn text-warning'
                                                                            href={route('prefinancement.edit', financement.id)}
                                                                        >
                                                                            <CIcon icon={cilPencil} />  Modifier
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('prefinancement.validate') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-success'
                                                                            onClick={(e) => validateFinancement(e, financement)}
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} />  Valider
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('prefinancement.delete') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-danger'
                                                                            onClick={(e) => deleteFinancement(e, financement)}
                                                                        >
                                                                            <CIcon icon={cilUserX} />  Supprimer
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ) : '---'
                                                }

                                            </td>
                                            <td>
                                                <span className="badge bg-light rounded text-dark rounded shadow-sm"> {financement?.reference ?? '---'}</span>
                                                <br />
                                                {financement.prefinancement &&
                                                    <small>
                                                        Transféré du financement : <span className="badge bg-success rounded text-white rounded shadow-sm">{financement.prefinancement?.reference}</span>
                                                    </small>
                                                }
                                            </td>
                                            <td>{`${financement?.gestionnaire?.lastname} - ${financement?.gestionnaire?.firstname}`}</td>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm">{financement.montant}</span></td>
                                            <td><strong className="badge bg-light rounded text-dark rounded shadow-sm">{financement.montant_dispatche}</strong></td>
                                            <td><strong className="badge bg-light rounded text-danger rounded shadow-sm">{financement.back_amount}</strong></td>
                                            <td className='text-center'>
                                                <span className="badge bg-light rounded text-success rounded shadow-sm">{financement.reste}</span>
                                                {
                                                    financement.reste > 0 && <button className="btn btn-sm btn-light border rounded w-100 shadow text-center"
                                                        onClick={(e) => transfertReste(e, financement)}> <CIcon icon={cilSend} className='text-success' /> Transferer </button>
                                                }
                                            </td>
                                            <td>{financement.date_financement}</td>
                                            <td>
                                                {financement.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={financement.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.createdBy?.firstname} - ${financement.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.validatedBy?.firstname || ''} - ${financement.validatedBy?.lastname || ''}`}</span> </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Model de transfert de reste */}
            <Modal show={showTransfert} onClose={closeTransfertModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilTruck} /> Transfert du reste du pré-financement <span className='badge bg-light rounded border shadow-sm text-success'>{currentFinancement?.reference ?? '---'}</span>
                    </h2>

                    <form onSubmit={submitTransfert} className="mt-6 space-y-6">
                        <div className="row d-flex justify-content-center">

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Select
                                        placeholder="Rechercher un gestionnaire ..."
                                        name="gestionnaire_id"
                                        id="gestionnaire_id"
                                        required
                                        className="form-control mt-1 block w-full"
                                        options={gestionnaires.map((gestionnaire) => ({
                                            value: gestionnaire.id,
                                            label: `${gestionnaire.firstname} - ${gestionnaire.lastname}`,
                                        }))}
                                        value={gestionnaires
                                            .map((gestionnaire) => ({
                                                value: gestionnaire.id,
                                                label: `${gestionnaire.firstname} - ${gestionnaire.lastname}`,
                                            }))
                                            .find((option) => option.value === data.gestionnaire_id)} // set selected option
                                        onChange={(option) => setData('gestionnaire_id', option.value)} // update state with id
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="reste" value="Reste du pré-financement" > <span className="text-danger">*</span> </InputLabel>
                                    <TextInput
                                        id="reste"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={currentFinancement?.reste}
                                        autoComplete="reste"
                                        readOnly={true}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.reste} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={closeTransfertModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}