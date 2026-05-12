import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cibAddthis } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ gestionnaires, types }) {
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
        type_id: "",
        gestionnaire_id: "",
        montant: "",
        date_financement: "",
        document: "",
    });


    const submit = (e) => {
        e.preventDefault();

        post(route('prefinancement.store'), {
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
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
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
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des pré-financements
                </h2>
            }
        >
            <Head title="Ajouter un pré financement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('prefinancement.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("prefinancement.index")}> <CIcon icon={cilList} /> Liste des pré-financements</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="gestionnaire_id" value="Gestionnaire" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un gestionnaire ..."
                                                name="gestionnaire_id"
                                                id="gestionnaire_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={gestionnaires.map((gestionnaire) => ({
                                                    value: gestionnaire.id,
                                                    label: `${gestionnaire.raison_sociale}`,
                                                }))}
                                                value={gestionnaires
                                                    .map((gestionnaire) => ({
                                                        value: gestionnaire.id,
                                                        label: `${gestionnaire.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.gestionnaire_id)} // set selected option
                                                onChange={(option) => setData('gestionnaire_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.gestionnaire_id} />
                                        </div>


                                        {/* types */}
                                        <div className="mb-3">
                                            <InputLabel htmlFor="type_id" value="Type de financement" ></InputLabel>
                                            <Select
                                                placeholder="Rechercher un type ..."
                                                name="type_id"
                                                id="type_id"
                                                // required
                                                className="form-control mt-1 block w-full"
                                                options={types.map((type) => ({
                                                    value: type.id,
                                                    label: `${type.libelle}`,
                                                }))}
                                                value={types
                                                    .map((type) => ({
                                                        value: type.id,
                                                        label: `${type.libelle}`,
                                                    }))
                                                    .find((option) => option.value === data.type_id)} // set selected option
                                                onChange={(option) => setData("type_id", option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.prefinancement_id} />
                                        </div>


                                        <div className='mb-3'>
                                            <InputLabel htmlFor="date_financement" value="Date de pré-financement" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="date_financement"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.date_financement}
                                                onChange={(e) => setData('date_financement', e.target.value)}
                                                autoComplete="date_financement"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.date_financement} />
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
                                                onChange={(e) => setData('montant', e.target.value)}
                                                autoComplete="montant"
                                                min={1}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="document" value="Document(preuve)" > </InputLabel>
                                            <TextInput
                                                id="document"
                                                type="file"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('document', e.target.files[0])}
                                                autoComplete="document"
                                            />

                                            <InputError className="mt-2" message={errors.document} />
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
