import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Update({ fond, chargements, superviseurs }) {
    const permissions = usePage().props.auth.permissions;
    console.log("Fond to intring ...", fond)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        patch,
        processing,
        // progress
    } = useForm({
        chargement_id: fond.chargement_id || '',
        superviseur_id: fond.superviseur_id || '',
        montant: fond.montant || 0,
        // document: "",
        commentaire: fond.commentaire || ''
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('fond-superviseur.update', { "fond_superviseur": fond.id }), {
            onStart: () => {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Opération en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            },
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>',
                    text: 'Opération réussie',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.error ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilPencil} /> Modifier le fond <span className="badge bg-light border rounded text-success">{fond.reference}</span>
                </h2>
            }
        >
            <Head title="Modifier un Fond" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('fond.superviseur.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("fond-superviseur.index")}> <CIcon icon={cilList} /> Liste des fonds aux superviseurs</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="chargement_id" value="Chargement" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un chargement ..."
                                                name="chargement_id"
                                                id="chargement_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={chargements.map((chargement) => ({
                                                    value: chargement.id,
                                                    label: `${chargement.reference}`,
                                                }))}
                                                value={chargements
                                                    .map((chargement) => ({
                                                        value: chargement.id,
                                                        label: `${chargement.reference}`,
                                                    }))
                                                    .find((option) => option.value === data.chargement_id)} // set selected option
                                                onChange={(option) => setData('chargement_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.chargement_id} />
                                        </div>
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Le montant" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="number"
                                                id="montant"
                                                className="mt-1 block w-full"
                                                value={data.montant}
                                                placeholder="Ex: 234567"
                                                onChange={(e) => setData('montant', e.target.value)}
                                                autoComplete="montant"
                                                min={1}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>

                                        {/* <div className='mb-3'>
                                            <InputLabel htmlFor="document" value="Document(preuve)" ></InputLabel>
                                            <TextInput
                                                id="file"
                                                type="file"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('document', e.target.file[0])}
                                                autoComplete="document"
                                            />
                                            <InputError className="mt-2" message={errors.document} />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}
                                        </div> */}

                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="superviseur_id" value="Superviseur" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un superviseur ..."
                                                name="superviseur_id"
                                                id="superviseur_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={superviseurs.map((superviseur) => ({
                                                    value: superviseur.id,
                                                    label: `${superviseur.raison_sociale}`,
                                                }))}
                                                value={superviseurs
                                                    .map((superviseur) => ({
                                                        value: superviseur.id,
                                                        label: `${superviseur.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.superviseur_id)} // set selected option
                                                onChange={(option) => setData('superviseur_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.superviseur_id} />
                                        </div>
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="commentaire" value="Commentaire" > </InputLabel>
                                            <TextInput
                                                id="commentaire"
                                                className="mt-1 block w-full"
                                                value={data.commentaire}
                                                placeholder="Ex: Fond attribué su superviseur Emmannuel"
                                                onChange={(e) => setData('commentaire', e.target.value)}
                                                autoComplete="commentaire"
                                            />

                                            <InputError className="mt-2" message={errors.commentaire} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
