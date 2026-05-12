import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cibMyspace } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'
import { Textarea } from '@headlessui/react';
import { useEffect } from 'react';


export default function Create({ fournisseurs }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
    } = useForm({
        fournisseur_id: "",
        montant: "",
        commentaire: "",
        preuve: "",
    });

    useEffect(() => {
        console.log("Data en cours de taritement :", data)
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">🫠 Ajout de requete en cours ...</span>', // yellow text
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('requete_fournisseur.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #2a7348;">👌 Opération réussie </span>', // yellow text
                    text: 'Requete crée avec succès',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibMyspace} /> Ajout des requetes fournisseur
                </h2>
            }
        >
            <Head title="Ajouter une classe" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('fournisseur.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("requete_fournisseur.index")}> <CIcon icon={cilArrowCircleLeft} /> Liste des rrequetes fournisseurs</Link>
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
                                                options={fournisseurs.map((f) => ({
                                                    value: f.id,
                                                    label: `${f.raison_sociale}`,
                                                }))}
                                                value={fournisseurs
                                                    .map((f) => ({
                                                        value: f.id,
                                                        label: `${f.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.fournisseur_id)} // set selected option
                                                onChange={(option) => setData("fournisseur_id", option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.fournisseur_id} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Le montant" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="number"
                                                id="montant"
                                                className="mt-1 block w-full"
                                                value={data.montant}
                                                placeholder="Ex: 234567"
                                                onChange={(e) => setData("montant", e.target.value)}
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
                                            <Textarea
                                                type="text"
                                                className="mt-1 block w-full form-control"
                                                value={data.commentaire}
                                                placeholder="Ex : Un commentaire"
                                                onChange={(e) => setData("commentaire", e.target.value)}
                                                required
                                                rows={1}
                                            />

                                            <InputError className="mt-2" message={errors.commentaire} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="preuve" value="Document(preuve)" > </InputLabel>
                                            <TextInput
                                                id="preuve"
                                                type="file"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('preuve', e.target.files[0])}
                                                autoComplete="preuve"
                                            />

                                            <InputError className="mt-2" message={errors.preuve} />
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
