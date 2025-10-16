import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';
import { cilUserX, cilCenterFocus, cilAlignCenter, cilLibraryAdd, cilList, cilTrash, cilSave } from "@coreui/icons";

export default function List({ inscriptions }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [showModal, setShowModal] = useState(false);
    const [currentInscription, setCurrentInscription] = useState(null);

    const { reset, setData, data, reste, errors, processing } = useForm({
        reste: null,
    })

    const confirmShowModal = (e, inscription) => {
        e.preventDefault();
        setShowModal(true);

        setCurrentInscription(inscription)
    };
    const closeModal = () => {
        setShowModal(false);

        // clearErrors();
        reset();
    };


    const showTransfertDossier = (inscription) => {
        Swal.fire({
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Dossier de transfert de : ${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            imageUrl: inscription.dossier_transfert,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Dossier de transfert",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }

    const generateReceit = (e) => {
        e.preventDefault();

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
                            <a target="_blank" href="${route('inscription.generate-receit', { inscription: currentInscription?.id, reste: data.reste })}">
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
                    <CIcon className='text-success' icon={cilList} /> Panel des inscriptions
                </h2>
            }
        >
            <Head title="Les Inscriptions" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('inscription.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("inscription.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Apprenant</th>
                                    <th scope="col">Numero Educ Master</th>
                                    <th scope="col">Dossier Transfert</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Frais d'inscription</th>
                                    <th scope="col">Inséré par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inscriptions.data.map((inscription, index) => (
                                        <tr key={inscription.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{`${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`}</td>
                                            <td>{inscription.numero_educ_master}</td>
                                            <td>
                                                <a target='__blank'
                                                    href={inscription.dossier_transfert}
                                                    className='btn btn-sm btn-light border bg-hover shadow-sm'
                                                // onClick={() => showTransfertDossier(inscription)}
                                                >
                                                    <CIcon icon={cilCenterFocus} />
                                                </a>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <span className="inline-flex rounded-md">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                            >
                                                                <CIcon icon={cilAlignCenter} /> Gérer
                                                            </button>
                                                        </span>
                                                    </Dropdown.Trigger>

                                                    <Dropdown.Content>
                                                        {checkPermission('inscription.imprimer.receit') ?
                                                            (<Dropdown.Link
                                                                href="#"
                                                                onClick={(e) => confirmShowModal(e, inscription)}
                                                            >
                                                                <CIcon icon={cilUserX} />  Generer un reçu
                                                            </Dropdown.Link>) : null
                                                        }
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                            <td><span className="badge bg-light border rounded text-dark">{inscription.frais_inscription}</span></td>
                                            <td>{`${inscription.createdBy?.firstname} - ${inscription.createdBy?.lastname}`}</td>
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
                        Reçu pour l'inscription de l'apprenant : <em className='text-success'>{currentInscription?.apprenant?.firstname} -  {currentInscription?.apprenant?.lastname} </em>
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois le reçu generé, un lien vous ai renvoyé via alert! Cliquez dessus pour télécharger le reçu.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="reste"
                            value="Reste à payer"
                            className="sr-only"
                        />

                        <TextInput
                            id="reste"
                            type="number"
                            name="reste"
                            ref={reste}
                            required
                            value={data.reste}
                            onChange={(e) =>
                                setData('reste', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Le reste"
                        />

                        <InputError
                            message={errors.reste}
                            className="mt-2"
                        />
                    </div>

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
