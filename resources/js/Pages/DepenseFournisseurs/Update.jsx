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

export default function Update({ depense, fournisseurs }) {
    const permissions = usePage().props.auth.permissions;
    console.log("Fond to intring ...", depense)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        patch,
        processing,
    } = useForm({
        fournisseur_id: depense.fournisseur_id || '',
        montant: depense.montant || 0,
        commentaire: depense.commentaire || ''
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('depense-fournisseur.update', { "depense_fournisseur": depense.id }), {
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
                    <CIcon className='text-success' icon={cilPencil} /> Modifier la depense <span className="badge bg-light border rounded text-success">{depense.reference}</span>
                </h2>
            }
        >
            <Head title="Modifier une depense" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('depense.superviseur.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("depense-fournisseur.index")}> <CIcon icon={cilList} /> Liste des dépenses fournisseurs</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="fournisseur_id" value="Fournisseur" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un fournisseur ..."
                                                name="fournisseur_id"
                                                id="fournisseur_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={fournisseurs.map((fournisseur) => ({
                                                    value: fournisseur.id,
                                                    label: `${fournisseur.raison_sociale}`,
                                                }))}
                                                value={fournisseurs
                                                    .map((fournisseur) => ({
                                                        value: fournisseur.id,
                                                        label: `${fournisseur.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.fournisseur_id)} // set selected option
                                                onChange={(option) => setData('fournisseur_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.fournisseur_id} />
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
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="commentaire" value="Commentaire" > </InputLabel>
                                            <TextInput
                                                id="commentaire"
                                                className="mt-1 block w-full"
                                                value={data.commentaire}
                                                placeholder="Ex: Depense fournisseur Kodjio"
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
