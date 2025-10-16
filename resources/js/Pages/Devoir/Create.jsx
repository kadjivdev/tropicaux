import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilLibraryAdd } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'


export default function Create({ schools, apprenants, trimestres, matieres }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        put,
        post,
        reset,
        processing,
        progress
    } = useForm({
        school_id: "",
        apprenant_id: "",
        trimestre_id: "",
        matiere_id: "",
        note: "",
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('devoir.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Devoir crée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
            // onFinish: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Panel d'ajout des dévoirs d'école
                </h2>
            }
        >
            <Head title="Ajouter une classe" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('devoir.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("devoir.index")}> <CIcon icon={cilArrowCircleLeft} /> Liste des écoles</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="L'école concernée" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={schools.data.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))}
                                                value={schools.data.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="apprenant_id" value="L'apprenant concerné" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher un apprenant ..."
                                                name="apprenant_id"
                                                id="apprenant_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={apprenants.data.map((apprenant) => ({
                                                    value: apprenant.id,
                                                    label: `${apprenant.firstname} - ${apprenant.lastname}`,
                                                }))}
                                                value={apprenants.data.map((apprenant) => ({
                                                    value: apprenant.id,
                                                    label: `${apprenant.firstname} - ${apprenant.lastname}`,
                                                }))
                                                    .find((option) => option.value === data.apprenant_id)} // set selected option
                                                onChange={(option) => setData('apprenant_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.apprenant_id} />
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="trimestre_id" value="Le trimestre concerné" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher un trimestre ..."
                                                name="trimestre_id"
                                                id="trimestre_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={trimestres.data.map((trimestre) => ({
                                                    value: trimestre.id,
                                                    label: `${trimestre.libelle}`,
                                                }))}
                                                value={trimestres.data.map((trimestre) => ({
                                                    value: trimestre.id,
                                                    label: `${trimestre.libelle}`,
                                                }))
                                                    .find((option) => option.value === data.trimestre_id)} // set selected option
                                                onChange={(option) => setData('trimestre_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.trimestre_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="matiere_id" value="La matière concernée" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher une matière ..."
                                                name="matiere_id"
                                                id="matiere_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={matieres.data.map((matiere) => ({
                                                    value: matiere.id,
                                                    label: `${matiere.libelle}`,
                                                }))}
                                                value={matieres.data.map((matiere) => ({
                                                    value: matiere.id,
                                                    label: `${matiere.libelle}`,
                                                }))
                                                    .find((option) => option.value === data.matiere_id)} // set selected option
                                                onChange={(option) => setData('matiere_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.matiere_id} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className='mb-3'>
                                        <InputLabel htmlFor="note" value="Note" > <span className="text-danger">*</span> </InputLabel>
                                        <TextInput
                                            id="note"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.note}
                                            placeholder="18.00"
                                            onChange={(e) => setData('note', e.target.value)}
                                            autoComplete="note"
                                            required
                                        />

                                        <InputError className="mt-2" message={errors.note} />
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
